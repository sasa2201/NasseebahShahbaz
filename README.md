# Nasseebah & Shahbaz — Digital Wedding Invitation

A single-page, scroll-driven wedding invite. A sealed envelope waits on
screen; tapping the wax seal sets off a burst of sparkling gold and petals,
then unlocks the page for scrolling. As you scroll, the flap folds open, the
letter rises out of the envelope, and the invitation details cross-fade in
one continuous flow — names, a short message, then date, time, and venue.
Keep scrolling and the letter sinks back in, the flap folds shut, and the
seal returns, closing the invitation the way it opened.

Palette is green and cream with gold accents, hand-drawn peony and butterfly
line-art, and a soft Islamic geometric pattern on the envelope. A drifting
canvas of petals, fireflies, and butterflies runs behind the whole scene.

## Files

```
index.html   — markup / structure / content placeholders
style.css    — all visual design, the envelope, and the scroll choreography
script.js    — wedding details (edit here), scroll math, seal tap effect,
               ambient canvas animation
README.md    — this file
```

No build step, no dependencies to install. It's plain HTML/CSS/JS, so it
runs straight out of the folder and is ready to host as-is.

## Customize the details

Open `script.js` and edit the `WEDDING_DATA` object at the very top of the
file — everything else in the codebase reads from it, so this is the only
place you need to touch for new names, wording, date, time, or venue:

```js
const WEDDING_DATA = {
  brideName: "Nasseebah",
  groomName: "Shahbaz",
  invitationMessage: "…",
  date: { day: "21", weekday: "Saturday", month: "November", year: "2026" },
  time: { headline: "4:00 in the evening", sub: "Guests kindly seated by 3:45 PM" },
  venue: { name: "…", address: "…", mapUrl: "https://maps.google.com/?q=…" },
  ...
};
```

Update `venue.mapUrl` with a real Google Maps link so "View on map" points
to the correct location.

## Preview locally

Any static file server works. From inside this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

or, with Node installed:

```bash
npx serve .
```

Opening `index.html` directly by double-clicking can also work, but a local
server is more reliable for testing scroll behavior on mobile emulation.

## Host it on GitHub Pages

1. Create a new GitHub repository (public, or private on paid plans).
2. Add these four files to the root of the repository — `index.html`,
   `style.css`, `script.js`, `README.md` — and push:

   ```bash
   git init
   git add .
   git commit -m "Wedding invitation site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, select `main` and folder `/ (root)`, then **Save**.
6. GitHub will publish the site at:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

   It can take a minute or two for the first deploy to go live. Any future
   push to `main` will automatically update the live site.

7. (Optional) To use a custom domain, add a `CNAME` file with your domain
   name to the repo root and configure the DNS records as GitHub's Pages
   docs describe, then set the domain under **Settings → Pages → Custom
   domain**.

## Notes on the experience

- **Accessibility**: if a visitor's system has "reduce motion" turned on,
  the animated envelope is skipped entirely and a clean, static invitation
  card is shown instead (see `.reduced-motion-fallback` in `style.css` /
  the reduced-motion branch in `script.js`).
- **Mobile-first**: the envelope, type scale, and scroll distances are all
  responsive; tested breakpoints sit at ~420px and ~900px in `style.css`.
- **Performance**: the drifting petals/fireflies/butterflies run on a single
  `<canvas>` with a capped, device-scaled particle count, and the scroll
  choreography only touches `transform`/`opacity`, so it stays smooth on
  mid-range phones.
- **Sharing**: the `<meta property="og:*">` tags in `index.html` control how
  the link previews when shared in WhatsApp, iMessage, etc. — update the
  `og:title` and `og:description` there if you change the names or wording.
