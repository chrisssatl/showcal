import { useState } from 'react'
import './App.css'

const STORAGE_KEY = 'tv-calendar-my-shows'

function loadMyShows() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveMyShows(shows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shows))
}

function getFeedUrl(showIds) {
  if (showIds.length === 0) return ''
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return `${base}/api/feed?shows=${showIds.join(',')}`
}

export default function App() {
  const [myShows, setMyShows] = useState(loadMyShows)
  const [copied, setCopied] = useState(false)
  const [showAddPanel, setShowAddPanel] = useState(false)

  const addShow = (show) => {
    if (myShows.some((s) => s.id === show.id)) return
    const next = [...myShows, { id: show.id, name: show.name }]
    setMyShows(next)
    saveMyShows(next)
  }

  const removeShow = (id) => {
    const next = myShows.filter((s) => s.id !== id)
    setMyShows(next)
    saveMyShows(next)
  }

  const feedUrl = getFeedUrl(myShows.map((s) => s.id))

  const copyUrl = async () => {
    if (!feedUrl) return
    try {
      await navigator.clipboard.writeText(feedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select the input so user can Cmd+C
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">TV Show Calendar</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAddPanel(!showAddPanel)}
          aria-expanded={showAddPanel}
        >
          Add show
        </button>
      </header>

      <main className="main">
        {showAddPanel && (
          <AddShowPanel onAdd={addShow} onClose={() => setShowAddPanel(false)} />
        )}

        <section className="section">
          <h2 className="section-title">My Shows</h2>
          {myShows.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No shows yet</p>
              <p className="empty-sub">Add your first show to build your calendar.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowAddPanel(true)}
              >
                Add show
              </button>
            </div>
          ) : (
            <ul className="show-list">
              {myShows.map((show) => (
                <li key={show.id} className="show-row">
                  <span className="show-name">{show.name}</span>
                  <button
                    type="button"
                    className="btn btn-remove"
                    onClick={() => removeShow(show.id)}
                    aria-label={`Remove ${show.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="section subscribe-block">
          <h2 className="section-title">Subscribe to calendar</h2>
          <p className="subscribe-hint">
            Add this URL in Apple Calendar, Google Calendar, or Outlook.
          </p>
          <div className="subscribe-row">
            <input
              type="text"
              className="subscribe-input"
              value={feedUrl}
              readOnly
              aria-label="Calendar feed URL"
            />
            <button
              type="button"
              className={`btn btn-primary ${copied ? 'btn-success' : ''}`}
              onClick={copyUrl}
              disabled={!feedUrl}
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

function AddShowPanel({ onAdd, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResults([])
    try {
      const res = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query.trim())}`
      )
      const data = await res.json()
      setResults(
        (data || []).map((item) => ({
          id: item.show.id,
          name: item.show.name,
          year: item.show.premiered ? item.show.premiered.slice(0, 4) : null,
        }))
      )
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    search()
  }

  return (
    <div className="add-panel">
      <div className="add-panel-header">
        <h2 className="section-title">Add show</h2>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Back
        </button>
      </div>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="search"
          className="search-input"
          placeholder="Search for a show…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search for a TV show"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
      {results.length > 0 && (
        <ul className="results-list">
          {results.map((show) => (
            <li key={show.id}>
              <button
                type="button"
                className="result-row"
                onClick={() => {
                  onAdd(show)
                  onClose()
                }}
              >
                <span className="result-name">{show.name}</span>
                {show.year && <span className="result-year">{show.year}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
