# for-her

A private letter page with an envelope you open, a short note, and a
set of questions she can answer. Her answers get saved to a database
so you can read them later at `/admin`.

## 1. Personalize it first

Open `app/page.js`. Every spot marked `EDIT THIS` is placeholder text —
the five "ledger" lines, the letter paragraphs, and the questions. Put
in things that are actually true and specific; it reads very
differently from generic lines. Add her name wherever it feels right —
none is hardcoded.

## 2. Run it locally (optional but recommended)

```bash
npm install
npm run dev
```

Open http://localhost:3000. The form will show an error when you
submit locally — that's expected, it can't reach a database until
it's deployed and connected to one (step 4).

## 3. Push it to GitHub

```bash
git init
git add .
git commit -m "for her"
```

Create a new (private) repo on GitHub and push this to it.

## 4. Deploy on Vercel

1. Go to vercel.com, "Add New Project", import the GitHub repo.
2. Click Deploy. It will build fine even before the database is
   connected — the page will load, only the form submit will fail
   until you finish the next step.

## 5. Add the database

1. In your Vercel project, open the **Storage** tab.
2. Create a new **Postgres** database (Vercel's marketplace option,
   powered by Neon) and accept the default name.
3. On the "Connect" step, select this project — Vercel automatically
   adds a connection env var (`DATABASE_URL` or `POSTGRES_URL`) for
   you. No copy-pasting connection strings needed. The code checks
   for either name, so whichever it sets will work.
4. Redeploy the project (Deployments tab → ⋯ → Redeploy) so the new
   environment variables take effect.

The `answers` table is created automatically the first time anyone
submits the form or you load `/admin` — you don't need to run any SQL
yourself.

## 6. Set your admin password

1. In the Vercel project, go to **Settings → Environment Variables**.
2. Add `ADMIN_PASSWORD` with a password only you know.
3. Redeploy once more.

## 7. Check her answers

Visit `yourdomain.vercel.app/admin`, enter the password, click
"View answers." Only that page (with the right password) can read
them — the public page can only submit, never read.

## Notes

- Nothing on the public page reveals that answers are saved anywhere
  or lets anyone but you read them.
- If you want to change or add questions later, edit the `QUESTIONS`
  array at the top of `app/page.js` — old answers stay in the
  database either way, matched by question text.
- Free Vercel + free-tier Postgres storage is plenty for this; you
  won't hit any limits from normal use.
