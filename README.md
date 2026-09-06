# Daynote

**A little space for your thoughts.**

Daynote is a full-stack personal journaling app: a quiet, warm digital notebook where you can write
entries, tag how the day felt, look back over your month, and find that one afternoon you wrote
about months later.

It is a real full-stack application — a React frontend talking to an Express REST API talking to
MongoDB, with real JWT authentication. Every journal entry belongs to exactly one user, and no user
can ever read, edit or delete another user's entries.

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Folder structure](#folder-structure)
4. [Quick start](#quick-start)
5. [Environment variables](#environment-variables)
6. [MongoDB setup](#mongodb-setup)
7. [Cloudinary setup (optional)](#cloudinary-setup-optional)
8. [Running the app](#running-the-app)
9. [Sample data](#sample-data)
10. [API overview](#api-overview)
11. [Deployment](#deployment)
12. [Accessibility & responsiveness](#accessibility--responsiveness)

---

## Features

- **Real authentication** — register, log in, log out. Passwords are hashed with bcrypt and never
  returned by the API. Routes are protected with JWT on both the client and the server.
- **Journal CRUD** — write, read, edit and delete entries with a title, content, mood, tags, a date,
  an optional photo, and a favourite flag. Drafts are supported.
- **Dashboard** — a time-aware greeting, a mood picker that opens the editor pre-filled, today's
  entry, recent entries, a seven-day mood strip and quick actions.
- **Search and filters** — debounced search across title, content and tags, plus mood, tag,
  favourite, draft and date filters, sorting and pagination.
- **Calendar** — month navigation with a soft indicator on days you wrote, and the entries for any
  day you click.
- **Mood tracker** — a mood-filled calendar, a donut of the month's mood distribution, the mood you
  felt most, and a gentle note about it.
- **Favourites** — a page for the entries you starred.
- **Settings** — change your name and bio, change your password, switch theme, delete your account.
- **Dark mode** — warm dark neutrals rather than an inverted light theme, remembered between visits.
- **Optional image uploads** — if Cloudinary keys are present the editor offers a photo uploader; if
  they are absent the app works exactly the same, minus that one feature.
- **Careful states** — skeleton loaders, friendly empty states, toast notifications and confirmation
  dialogs throughout.

---

## Tech stack

| Layer     | Technology                                                              |
| --------- | ----------------------------------------------------------------------- |
| Frontend  | React 18, Vite, JavaScript, Tailwind CSS, React Router, Axios, Lucide    |
| Backend   | Node.js, Express, JWT, bcryptjs, dotenv, CORS, Multer                    |
| Database  | MongoDB with Mongoose (works locally or with MongoDB Atlas)              |
| Images    | Cloudinary (entirely optional)                                          |
| Deploy    | Frontend on Vercel, backend on Render or Railway, database on Atlas      |

---

## Folder structure

```
Daynote/
├── package.json           # convenience scripts to run both halves at once
├── backend/
│   ├── server.js          # Express app: middleware, routes, error handling
│   ├── config/            # db.js (Mongoose), cloudinary.js (optional uploads)
│   ├── controllers/       # auth, journal, user, upload
│   ├── middleware/        # auth (JWT), errorHandler, upload (Multer)
│   ├── models/            # User.js, Journal.js
│   ├── routes/            # authRoutes, journalRoutes, userRoutes, uploadRoutes
│   ├── utils/             # response helpers, token generation, seed.js
│   └── .env.example
└── frontend/
    ├── index.html
    ├── tailwind.config.js
    └── src/
        ├── components/    # Sidebar, JournalCard, MoodSelector, Toast, Calendar, …
        ├── pages/         # Landing, Login, Register, Dashboard, MyJournal, …
        ├── context/       # AuthContext, ThemeContext, ToastContext
        ├── services/      # axios instance + api, auth, journal, user, upload
        ├── hooks/         # useDebounce, useJournals
        ├── utils/         # moods.js, format.js
        └── index.css      # theme tokens and component classes
```

---

## Quick start

You need **Node.js 18+** and a MongoDB database (local or Atlas).

```bash
# 1. Install dependencies for the root, backend and frontend
npm install
npm run install:all

# 2. Create the environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Open backend/.env and set MONGO_URI and JWT_SECRET (see below)

# 4. Optional: load the demo account and sample entries
npm run seed

# 5. Run both the API and the web app together
npm run dev
```

The API starts on <http://localhost:5000> and the web app on <http://localhost:5173>.

> On Windows, `cp` is available in Git Bash or PowerShell 7+. In older PowerShell use
> `Copy-Item backend\.env.example backend\.env`.

---

## Environment variables

### Backend — `backend/.env`

| Variable                | Required | Description                                                        |
| ----------------------- | -------- | ------------------------------------------------------------------ |
| `PORT`                  | no       | Port for the API. Defaults to `5000`.                              |
| `MONGO_URI`             | **yes**  | MongoDB connection string.                                         |
| `JWT_SECRET`            | **yes**  | A long random string used to sign tokens.                          |
| `JWT_EXPIRES_IN`        | no       | Token lifetime. Defaults to `7d`.                                  |
| `CLIENT_URL`            | no       | Allowed CORS origin(s), comma separated. Defaults to the Vite port. |
| `CLOUDINARY_CLOUD_NAME` | no       | Leave blank to run without image uploads.                          |
| `CLOUDINARY_API_KEY`    | no       | Leave blank to run without image uploads.                          |
| `CLOUDINARY_API_SECRET` | no       | Leave blank to run without image uploads.                          |

A good `JWT_SECRET` can be generated with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend — `frontend/.env`

| Variable       | Required | Description                                                                     |
| -------------- | -------- | ------------------------------------------------------------------------------- |
| `VITE_API_URL` | no       | Base URL of the API. Leave **blank** in development — Vite proxies `/api` to :5000. |

In production set it to your deployed API, for example
`VITE_API_URL=https://daynote-api.onrender.com`.

> Never commit `.env` files. Both `.gitignore` files already exclude them.

---

## MongoDB setup

### Option A — MongoDB Atlas (recommended, free tier)

1. Create an account at <https://www.mongodb.com/cloud/atlas> and make a free **M0** cluster.
2. **Database Access** → add a database user with a username and password.
3. **Network Access** → add your IP, or `0.0.0.0/0` while you are developing.
4. **Connect** → **Drivers** → copy the connection string, which looks like:

   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/daynote?retryWrites=true&w=majority
   ```

5. Replace `<user>` and `<password>`, keep `/daynote` as the database name, and put the result in
   `backend/.env` as `MONGO_URI`.

### Option B — MongoDB locally

Install MongoDB Community Server, start it, and use:

```
MONGO_URI=mongodb://127.0.0.1:27017/daynote
```

Mongoose creates the collections and indexes on first use — there is nothing to set up by hand.

---

## Cloudinary setup (optional)

Image upload is **off by default and completely optional**. The app checks
`GET /api/upload/status` and simply hides the uploader when it is not configured.

To turn it on:

1. Create a free account at <https://cloudinary.com>.
2. From the dashboard copy your **Cloud name**, **API Key** and **API Secret**.
3. Put all three in `backend/.env` and restart the API.

Uploads are limited to image files up to 5 MB and are stored per-user under `daynote/<userId>/`.

---

## Running the app

From the project root:

| Command                | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Runs the API and the web app together               |
| `npm run dev:backend`  | Runs only the API (nodemon, restarts on change)     |
| `npm run dev:frontend` | Runs only the web app (Vite dev server)             |
| `npm run seed`         | Loads the demo account and sample entries           |
| `npm run build`        | Builds the frontend into `frontend/dist`            |
| `npm start`            | Runs the API in production mode                     |

You can also run each half on its own:

```bash
cd backend  && npm run dev    # http://localhost:5000
cd frontend && npm run dev    # http://localhost:5173
```

Check the API is healthy at <http://localhost:5000/api/health>.

---

## Sample data

`npm run seed` creates **development/demo data only** — one demo account plus a month of realistic
sample entries so the dashboard, calendar and mood tracker have something to show while you build.

```
email:    demo@daynote.app
password: daynote123
```

Running it again clears and recreates only that demo user's entries. **Do not run it against a
production database.**

---

## API overview

Base URL: `/api`. All responses use the same shape.

Success:

```json
{ "success": true, "message": "Journal entry created successfully", "data": {} }
```

Error:

```json
{ "success": false, "message": "Something went wrong" }
```

Protected endpoints expect an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint             | Auth | Description                             |
| ------ | -------------------- | ---- | --------------------------------------- |
| POST   | `/api/auth/register` | no   | Create an account, returns a JWT        |
| POST   | `/api/auth/login`    | no   | Sign in, returns a JWT                  |
| GET    | `/api/auth/me`       | yes  | The signed-in user                      |

### Journals

| Method | Endpoint                      | Description                          |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | `/api/journals`               | List the user's entries (filterable) |
| GET    | `/api/journals/:id`           | One entry                            |
| POST   | `/api/journals`               | Create an entry                      |
| PUT    | `/api/journals/:id`           | Update an entry                      |
| DELETE | `/api/journals/:id`           | Delete an entry                      |
| PATCH  | `/api/journals/:id/favorite`  | Toggle or set the favourite flag     |
| GET    | `/api/journals/stats`         | Mood distribution and totals         |
| GET    | `/api/journals/tags`          | Every tag the user has used          |

Supported query parameters on `GET /api/journals`:

```
?search=college        matches title, content and tags (case-insensitive)
?mood=happy            one of the nine moods
?tag=college           a single tag
?favorite=true         only favourites
?drafts=true|false     only drafts, or only finished entries
?from=&to=             ISO dates, filters by entry date
?sort=newest|oldest    default newest
?page=1&limit=12       pagination
```

### User

| Method | Endpoint              | Description                                  |
| ------ | --------------------- | -------------------------------------------- |
| PUT    | `/api/users/profile`  | Update name, bio, avatar or theme            |
| PUT    | `/api/users/password` | Change the password (verifies the old one)   |
| DELETE | `/api/users/me`       | Delete the account and all of its entries    |

### Upload

| Method | Endpoint              | Description                                       |
| ------ | --------------------- | ------------------------------------------------- |
| GET    | `/api/upload/status`  | Whether image upload is configured                |
| POST   | `/api/upload`         | Upload one image (multipart field name `image`)   |

### Data models

**User** — `_id`, `name`, `email` (unique), `password` (hashed, never returned), `bio`, `avatarUrl`,
`theme`, `createdAt`, `updatedAt`.

**Journal** — `_id`, `userId`, `title`, `content`, `mood`, `tags[]`, `date`, `isFavorite`,
`isDraft`, `imageUrl`, `createdAt`, `updatedAt`.

Every journal query is scoped to `userId` from the verified token, so a user can only ever reach
their own entries. Requesting someone else's entry returns a 404.

---

## Deployment

### Database — MongoDB Atlas

Use the Atlas steps above. Allow access from your backend host (Render and Railway do not publish
fixed IPs, so `0.0.0.0/0` with a strong password is the usual choice).

### Backend — Render

1. Push the repository to GitHub.
2. On Render: **New** → **Web Service** → connect the repo.
3. Set **Root Directory** to `backend`.
4. **Build Command**: `npm install` · **Start Command**: `npm start`
5. Add the environment variables from `backend/.env.example`. Set `CLIENT_URL` to your Vercel URL.
6. Deploy, then check `https://<your-service>.onrender.com/api/health`.

**Railway** is the same idea: new project from the repo, root directory `backend`, start command
`npm start`, then add the variables.

### Frontend — Vercel

1. On Vercel: **Add New** → **Project** → import the repo.
2. Set **Root Directory** to `frontend`. The framework preset is Vite.
3. **Build Command**: `npm run build` · **Output Directory**: `dist`
4. Add the environment variable `VITE_API_URL` pointing at your deployed API.
5. Deploy.

`frontend/vercel.json` already rewrites all routes to `index.html` so client-side routing works on
refresh.

After both are live, make sure the backend's `CLIENT_URL` contains the exact Vercel origin —
otherwise CORS will block the browser.

---

## Accessibility & responsiveness

- Semantic landmarks, a skip link, labelled form fields and labelled icon buttons.
- The mood picker is a real radio group; the confirmation dialog traps focus and closes on Escape.
- Visible focus rings throughout, and `prefers-reduced-motion` is respected.
- Desktop uses the persistent sidebar; below `lg` it switches to a bottom bar with a drawer for the
  rest of the pages, so the writing area keeps the full width on a phone.
- Verified at 390px, 820px and 1440px with no horizontal overflow.

---

Daynote — a little space for your thoughts.
