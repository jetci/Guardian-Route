# Handling Secrets and Rotating Exposed Credentials

This project previously contained a committed `backend/.env` with sensitive values. The file has been removed from the repository and replaced by `backend/.env.example`.

Immediate actions taken
- Removed `backend/.env` from the repository working tree.
- Added `backend/.env` to `.gitignore` (already present in repo .gitignore).

Recommended next steps (follow urgently):

1) Rotate exposed credentials
   - Identify credentials that were present in `backend/.env` (DB user/password, JWT secrets, etc.).
   - Rotate them immediately in the systems where they are used (Postgres user password, any external APIs).
   - If you use managed DB (e.g., RDS), change the password and update connection strings.

2) Replace secrets with secrets manager
   - For GitHub Actions: store values in repository or organization Secrets (Settings → Secrets).
   - For deployment: use the cloud provider secret manager (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager) or Kubernetes Secrets.

3) Update CI and deployment pipelines
   - Do not rely on commited `.env` files. Instead, reference secrets from CI or environment configuration.
   - Example: `DATABASE_URL` from GitHub Secrets is injected into the workflow or runtime env.

4) Remove sensitive values from git history (optional but recommended)
   - If secrets were present in past commits, consider scrubbing history using `git filter-repo` or BFG:

     - BFG example:
       - `bfg --delete-files backend/.env`
       - `git reflog expire --expire=now --all && git gc --prune=now --aggressive`

     - `git filter-repo` example:
       - `git filter-repo --path backend/.env --invert-paths`

   - WARNING: rewriting history requires force-pushing and coordinating with all collaborators.

5) Document and onboard developers
   - Keep `backend/.env.example` up to date.
   - Add onboarding docs to explain how to obtain and set secrets locally and in CI.

6) Verify after rotation
   - Restart services that depend on rotated secrets.
   - Run integration tests or health checks to confirm services work with new credentials.

If you want, I can prepare an automated PR that:
- Removes `backend/.env` (already removed locally),
- Adds `SECURITY.md` (this file),
- Adds a small script to help set environment vars from OS environment or CI secrets, and
- Provide a suggested GitHub Actions change to read `DATABASE_URL` from secrets.

Rotation script
----------------
I added `scripts/rotate-db-password.sh` to this repository. Usage example:

```bash
PGPASSWORD=oldAdminPass ./scripts/rotate-db-password.sh db.example.com 5432 guardian_admin 'NewS3cret!' postgres
```

This script runs a single SQL statement to change the password for the specified database user. After rotating credentials, update your CI secrets (e.g., `DATABASE_URL`) and restart services.

CI changes
----------
The GitHub Actions workflow was updated to read `DATABASE_URL` and `JWT_SECRET` from repository secrets. Make sure to add those values in the repository Settings → Secrets before relying on CI.
