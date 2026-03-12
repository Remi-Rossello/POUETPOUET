---
applyTo: "frontend/**"
---

# Frontend Agent Instructions

## Dev Server

- Always use port 5173 to see the website
- Before running the frontend dev server with vite, check if there is already a terminal running it. If so, don't run it a separate time unless for a specific reason.
- Before opening the frontend in the integrated browser, wait until Vite explicitly reports that the local dev server is ready on `http://127.0.0.1:5173/` or `http://localhost:5173/`.
- If that ready message has not appeared yet, do not try to load the page in the browser first.

## Accessibility

- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, etc.) instead of generic `<div>` or `<span>` where appropriate.
- All images must have meaningful `alt` attributes (or `alt=""` for purely decorative images).
- Use ARIA attributes (`aria-label`, `aria-labelledby`, `aria-describedby`, `role`, etc.) only when native semantics are insufficient.
- Form inputs must have associated `<label>` elements.
- Ensure dynamic content updates are announced to screen readers (e.g., via `aria-live` regions).
