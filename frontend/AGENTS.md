---
applyTo: "frontend/**"
---

# Frontend Agent Instructions

## Accessibility

- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, etc.) instead of generic `<div>` or `<span>` where appropriate.
- All images must have meaningful `alt` attributes (or `alt=""` for purely decorative images).
- Use ARIA attributes (`aria-label`, `aria-labelledby`, `aria-describedby`, `role`, etc.) only when native semantics are insufficient.
- Form inputs must have associated `<label>` elements.
- Ensure dynamic content updates are announced to screen readers (e.g., via `aria-live` regions).
