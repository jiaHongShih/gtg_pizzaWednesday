# GrowToGather — Event Landing (AWS Amplify ready) <now using github>

A minimal, production-ready landing page for an event:
- Plays an intro video (YouTube or MP4)
- CTA button opens your Google Form for registration
- Built with React + TypeScript + Vite
- Simple CSS (no Tailwind dependency) to avoid setup friction
- Ready for AWS Amplify Hosting

## 1) Configure
Create a `.env` file (or Amplify environment variables) with:

```
VITE_FORM_URL=https://forms.gle/your-google-form-id
VITE_VIDEO_URL=https://www.youtube.com/watch?v=XXXXXXXXXXX
# or use an MP4 URL for VITE_VIDEO_URL
```

### Notes
- If `VITE_VIDEO_URL` points to YouTube (youtube.com or youtu.be), the app auto-embeds it.
- Otherwise it renders an HTML5 `<video>` tag.

## 2) Run locally
```bash
npm install
npm run dev
```

## 3) Deploy to AWS Amplify
### Option A — Connect your GitHub repo
1. Push this project to GitHub.
2. Open **AWS Amplify Console** → **Host web app** → Connect GitHub → select repo & branch.
3. In **Build settings → Environment variables**, add:
   - `VITE_FORM_URL`
   - `VITE_VIDEO_URL`
4. Save & Deploy. Amplify will build and give you a public URL.

### Option B — Amplify from CLI
```bash
npm install -g @aws-amplify/cli
amplify init
# (optional) amplify add hosting
amplify publish
```
Then set env vars in the Amplify Console (App settings → Build settings → Environment variables) and Redeploy.

## 4) Customize
- Replace title/subtitle text in `src/App.tsx`
- Add your logo in the header (e.g., an `<img>` next to the dot)
- Update SEO tags in `index.html`

## 5) Accessibility & SEO
- The video section has appropriate titles/labels.
- Button has `rel="noreferrer noopener"` and respects disabled state when missing env vars.
- Open Graph tags included in `index.html`.

## 6) Tech
- React 18 + TypeScript
- Vite
- Vanilla CSS (lightweight & fast)
