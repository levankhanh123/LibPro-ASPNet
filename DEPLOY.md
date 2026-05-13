# Deploy LibPro

Target:

- Database: Aiven SQL Server
- Backend: Render
- Frontend: Vercel

## 1. Aiven SQL Server

Create an Aiven SQL Server service, then copy its host, port, database, username, and password.

Use this connection string format on Render:

```text
Server=tcp:<AIVEN_HOST>,<AIVEN_PORT>;Database=<AIVEN_DATABASE>;User Id=<AIVEN_USER>;Password=<AIVEN_PASSWORD>;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;
```

If you use Aiven CA verification instead of `TrustServerCertificate=True`, configure the certificate according to Aiven's SQL Server instructions on your hosting target.

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
ConnectionStrings__DefaultConnection=Server=tcp:<AIVEN_HOST>,<AIVEN_PORT>;Database=<AIVEN_DATABASE>;User Id=<AIVEN_USER>;Password=<AIVEN_PASSWORD>;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;
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
- If you use a custom domain later, update `Cors__AllowedOrigins`, `Jwt__ValidAudience`, and `VITE_API_URL`.
