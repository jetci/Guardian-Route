# Deployment guide — Guardian Route

This document provides example deployment steps for production-ready runs.

1) Secrets
  - Store `DATABASE_URL`, `JWT_SECRET`, and any other secrets in your environment or secret manager.
  - For GitHub Actions, add them under repository Settings → Secrets.
  - For Vercel, add under Project → Settings → Environment Variables.

2) Frontend (Vercel recommended)
  - Connect the repo to Vercel and enable Preview Deploys.
  - Ensure the project `Build Command` runs the frontend build (e.g. `npm --prefix frontend ci && npm --prefix frontend run build`) and `Output Directory` is `frontend/build`.
  - `vercel.json` is included to help Vercel detect the static build.

3) Backend (long-running service)
  - Backend is a NestJS application that is better run on a container host or PaaS supporting long-running processes (Render, Fly.io, AWS ECS/Fargate, DigitalOcean App Platform, Heroku).
  - Example Dockerfile (multi-stage) included at `backend/Dockerfile`.

Render example (recommended quick host)
-------------------------------------
- Create a new Web Service on Render.
- Set the `Dockerfile` repo root to `backend/Dockerfile` and set the start command: `node dist/src/main.js`.
- Add environment variable `DATABASE_URL` in the Render dashboard and other secrets.

Kubernetes example
------------------
- See `deploy/k8s-deployment.yaml` (example) for a Deployment + Service + liveness/readiness probe that checks `/api/health`.

4) Orchestration / Health
  - `docker-compose.yml` includes DB and redis healthchecks and a backend healthcheck against `/api/health`.
  - Use readiness probes in Kubernetes or service healthchecks in Docker to avoid routing traffic to not-ready containers.

5) Migrations and Prisma
  - Ensure `npx prisma generate` runs during build (Dockerfile does this in the builder stage).
  - Apply migrations at deploy time if you use Prisma Migrate (run `npx prisma migrate deploy`).

6) Backups & Monitoring
  - Enable automated DB backups (managed DB) or nightly pg_dump + offsite storage.
  - Add application metrics + alerting (Prometheus + Grafana or cloud provider monitoring) and set alerts for DB availability, error rate, and CPU/memory.

If you want, I can prepare a `deploy/` folder with the following files:
- `deploy/k8s-deployment.yaml` (Deployment, Service, Ingress example)
- `deploy/render-service.yaml` (Render service example)
- `deploy/README.md` with step-by-step instructions
