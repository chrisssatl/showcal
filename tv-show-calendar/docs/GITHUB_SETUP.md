# Connecting this project to GitHub

**Purpose:** Step-by-step to connect `tv-show-calendar` to a GitHub repo and push your code.

---

## 1. Create a new repo on GitHub

1. Go to [github.com](https://github.com) and sign in.
2. Click **New** (green button) or go to [github.com/new](https://github.com/new).
3. Fill in:
   - **Repository name:** `tv-show-calendar` (or any name you like).
   - **Description:** e.g. “Web app to track TV shows and subscribe to episode air dates.”
   - **Public** (or Private if you prefer).
   - **Do not** check “Add a README” or “Add .gitignore” — we already have them.
4. Click **Create repository**.

---

## 2. Initialize Git and connect (run in your terminal)

Open a terminal, go to the project folder, then run:

```bash
cd /Users/chris/tv-show-calendar

# Initialize Git (if not already done)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: docs and project setup"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/tv-show-calendar.git

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username (and `tv-show-calendar` if you used a different repo name).

---

## 3. If you use SSH instead of HTTPS

If your GitHub account uses SSH keys:

```bash
git remote add origin git@github.com:YOUR_USERNAME/tv-show-calendar.git
git branch -M main
git push -u origin main
```

---

## 4. After the first push

- Your code will be at `https://github.com/YOUR_USERNAME/tv-show-calendar`.
- For future changes: `git add .` → `git commit -m "Your message"` → `git push`.
- When we add the React app and Vercel, we can connect Vercel to this repo for automatic deploys.

---

## Troubleshooting

| Issue | What to do |
|-------|------------|
| “Permission denied” or “Authentication failed” | Use a [Personal Access Token](https://github.com/settings/tokens) with HTTPS, or set up [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh). |
| “remote origin already exists” | Run `git remote remove origin` then add it again with the correct URL. |
| Repo already has a README on GitHub | Run `git pull origin main --allow-unrelated-histories` before pushing, or create the repo **empty** (no README) and then push. |
