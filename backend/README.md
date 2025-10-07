# Task Workflow API

1. Copy .env.example -> .env and fill values
2. npm install
3. npm run dev
4. Mongo DB must be running (local or remote)
5. Register an admin user via /api/auth/register with role=admin
6. Use the returned token for requests (Authorization: Bearer <token>)
