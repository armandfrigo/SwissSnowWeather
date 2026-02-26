# Swiss Snow Weather

This repository contains a small static web application that displays current
weather conditions for popular ski resorts in the Geneva region. The data is
fetched from the public [Open-Meteo](https://open-meteo.com) API and the front‑end
is built with React and Vite.

## Features

- Responsive card grid showing resorts such as Chamonix, Verbier, Zermatt,
  Gstaad and Crans-Montana.
- Weather icons and descriptions based on Open-Meteo weather codes.
- Mobile-friendly layout using CSS Grid/Flexbox.
- No API keys or secrets – the app calls a public endpoint over HTTPS.

## Development

```bash
npm install   # first time only
npm run dev   # start dev server at http://localhost:5173
```

## Build & Deployment

```bash
npm run build  # generates optimized `dist/` folder
```

A GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds
and publishes the `dist` directory to the `gh-pages` branch on every push to
`main`. The site will then be available at
`https://<your-user>.github.io/<repo-name>/`.

> **Note:** `vite.config.ts` sets `base: './'` so the output works with
> GitHub Pages' sub‑directory URLs.

## License

This project is licensed under the MIT License (see [LICENSE](LICENSE)).

