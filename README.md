# Infomats Real Estate

A full-stack Australian real-estate platform built with Next.js, Prisma, and PostgreSQL.

## Local development

Install dependencies, configure `.env.local`, and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production architecture

- Firebase Hosting provides the public domain and CDN.
- Google Cloud Run hosts the Next.js server in Sydney.
- DigitalOcean Managed PostgreSQL stores application data.
- Google Secret Manager protects database and JWT credentials.
- Authentication uses application users, roles, bcrypt passwords, JWT sessions, and HTTP-only cookies.

Production: [infomats-realestate.web.app](https://infomats-realestate.web.app)

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run db:validate
npm run build
```

## Deployment

The repository contains a production `Dockerfile`, Firebase project mapping, and a Firebase Hosting rewrite to the `infomats-realestate` Cloud Run service. Runtime secrets are supplied through Google Secret Manager.

Do not commit `.env.local` or other credential files.
