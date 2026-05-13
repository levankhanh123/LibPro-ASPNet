# Deploy LibPro

Target:

- Database: Aiven MySQL
- Backend: Render
- Frontend: Vercel

## 1. Aiven MySQL

Use the free Aiven MySQL service you created.

In Aiven, open the MySQL service and copy:

```text
Host
Port
Database
User
Password
```

The default database is often:

```text
defaultdb
```

Import the MySQL script into that database before the first Render backend deploy if you want the full sample data:

```text
LibPro_Database.mysql.sql
```

The original `LibPro_Database.sql` is SQL Server format. Do not import it into Aiven MySQL.

Use this connection string format on Render:

```text
Server=<AIVEN_HOST>;Port=<AIVEN_PORT>;Database=<AIVEN_DATABASE>;Uid=<AIVEN_USER>;Pwd=<AIVEN_PASSWORD>;SslMode=Required;
```

Example:

```text
Server=mysql-xxxxx.aivencloud.com;Port=12345;Database=defaultdb;Uid=avnadmin;Pwd=your-password;SslMode=Required;
```

## 2. Render Backend

Create a new **Blueprint** from this repository, or create a **Web Service** manually:

- Environment: `Docker`
- Dockerfile path: `./LibPro/Dockerfile`
- Docker build context: `.`
- Port: `8080`

Set these environment variables in Render:

```text
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ConnectionStrings__DefaultConnection=Server=<AIVEN_HOST>;Port=<AIVEN_PORT>;Database=<AIVEN_DATABASE>;Uid=<AIVEN_USER>;Pwd=<AIVEN_PASSWORD>;SslMode=Required;
Jwt__Key=<LONG_RANDOM_SECRET_AT_LEAST_32_CHARS>
Jwt__ValidAudience=https://<your-vercel-domain>
Jwt__ValidIssuer=https://<your-render-service>.onrender.com
SecureToken__Key=<LONG_RANDOM_SECRET_AT_LEAST_32_CHARS>
Cors__AllowedOrigins=https://<your-vercel-domain>
```

After the first deploy, copy the Render URL. It will look like:

```text
https://libpro-api.onrender.com
```

## 3. Vercel Frontend

Import the same GitHub repository into Vercel.

Set the Vercel project root directory to:

```text
Frontend
```

Set this environment variable in Vercel:

```text
VITE_API_URL=https://<your-render-service>.onrender.com
```

Build settings:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
```

After Vercel gives you a frontend URL, add that exact URL back into Render:

```text
Cors__AllowedOrigins=https://<your-vercel-domain>
Jwt__ValidAudience=https://<your-vercel-domain>
```

Then redeploy both services.

## Notes

- Do not commit real Aiven passwords or JWT keys.
- Render environment variables with `__` map to ASP.NET configuration sections.
- Vercel environment variables must be set before building the frontend.
- The backend now uses MySQL provider for Aiven MySQL.
- If the Aiven database is empty, the backend can create schema at startup with the app's minimal seed data.
- If you want the full sample data from your SQL file, import `LibPro_Database.mysql.sql` before the first backend deploy, or start from an empty database before importing it.
- If you use a custom domain later, update `Cors__AllowedOrigins`, `Jwt__ValidAudience`, and `VITE_API_URL`.
