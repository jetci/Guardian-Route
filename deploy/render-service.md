# Render deployment example

1. Create a new Web Service on Render using Docker.
2. Set the `Root Directory` to `backend` (or use monorepo settings).
3. Dockerfile: use the included `backend/Dockerfile`.
4. Environment:
   - `DATABASE_URL`: set from Render secrets
   - `JWT_SECRET`: set from Render secrets
5. Start Command: `node dist/src/main.js`

Render will build the Dockerfile and run the service as a long-running process.
