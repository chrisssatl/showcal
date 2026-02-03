/**
 * Vercel serverless function: GET /api/feed?shows=1,2,3
 * Fetches TVMaze episodes for each show ID and returns an iCal (.ics) feed.
 */

const TVMAZE_BASE = 'https://api.tvmaze.com'

/** Escape text for iCal (backslash, semicolon, comma, newline) */
function escapeIcalText(str) {
  if (str == null || typeof str !== 'string') return ''
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/** Fold a long iCal line (max 75 octets; continuation lines start with space + 74 chars) */
function foldLine(line) {
  const firstMax = 75
  const nextMax = 74
  if (line.length <= firstMax) return line
  const parts = [line.slice(0, firstMax)]
  let remaining = line.slice(firstMax)
  while (remaining.length > 0) {
    parts.push('\r\n ' + remaining.slice(0, nextMax))
    remaining = remaining.slice(nextMax)
  }
  return parts.join('')
}

/** Format YYYY-MM-DD as iCal DATE value YYYYMMDD */
function toIcalDate(airdate) {
  if (!airdate || !/^\d{4}-\d{2}-\d{2}$/.test(airdate)) return null
  return airdate.replace(/-/g, '')
}

/** Build iCal (.ics) body from events array: { uid, startDate, summary, description } */
function buildIcal(events) {
  const now = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TV Show Calendar//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:TV Show Calendar',
  ]
  for (const ev of events) {
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${ev.uid}`)
    lines.push(`DTSTAMP:${now}`)
    lines.push(`DTSTART;VALUE=DATE:${ev.startDate}`)
    lines.push(`DTEND;VALUE=DATE:${ev.startDate}`)
    lines.push(`SUMMARY:${escapeIcalText(ev.summary)}`)
    if (ev.description) lines.push(`DESCRIPTION:${escapeIcalText(ev.description)}`)
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return lines.map((line) => foldLine(line)).join('\r\n')
}

async function fetchShow(id) {
  const res = await fetch(`${TVMAZE_BASE}/shows/${id}`)
  if (!res.ok) return null
  return res.json()
}

async function fetchEpisodes(showId) {
  const res = await fetch(`${TVMAZE_BASE}/shows/${showId}/episodes`)
  if (!res.ok) return []
  return res.json()
}

/** Collect events from show + episodes; only include episodes with airdate in range */
function toEvents(show, episodes, rangeStart, rangeEnd) {
  const events = []
  const showName = show?.name || `Show ${show?.id ?? '?'}`
  for (const ep of episodes || []) {
    const airdate = ep.airdate
    const dateStr = toIcalDate(airdate)
    if (!dateStr) continue
    if (airdate < rangeStart || airdate > rangeEnd) continue
    const summary = `${showName} - ${ep.name || 'Episode'}`
    const desc = ep.season != null && ep.number != null ? `S${ep.season}E${ep.number}` : ''
    events.push({
      uid: `tvmaze-ep-${ep.id}@tv-show-calendar`,
      startDate: dateStr,
      summary,
      description: desc,
    })
  }
  return events
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).send('Method Not Allowed')
  }

  const raw = req.query.shows
  const showIds = (typeof raw === 'string' ? raw.split(',') : Array.isArray(raw) ? raw : [])
    .map((s) => String(s).trim())
    .filter((s) => /^\d+$/.test(s))

  if (showIds.length === 0) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    return res.status(400).send('Missing or invalid query: shows=id1,id2,...')
  }

  // Limit to avoid abuse and timeouts
  const limitedIds = showIds.slice(0, 30)

  const rangeStart = new Date()
  rangeStart.setDate(rangeStart.getDate() - 14)
  const rangeEnd = new Date()
  rangeEnd.setDate(rangeEnd.getDate() + 180)
  const startStr = rangeStart.toISOString().slice(0, 10)
  const endStr = rangeEnd.toISOString().slice(0, 10)

  try {
    const results = await Promise.all(
      limitedIds.map(async (id) => {
        const [show, episodes] = await Promise.all([fetchShow(id), fetchEpisodes(id)])
        return toEvents(show, episodes, startStr, endStr)
      })
    )
    const allEvents = results.flat()
    allEvents.sort((a, b) => a.startDate.localeCompare(b.startDate))

    const ics = buildIcal(allEvents)
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.status(200).send(ics)
  } catch (err) {
    console.error('Feed error:', err)
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    return res.status(500).send('Failed to build calendar feed.')
  }
}
