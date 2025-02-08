## Developing

Once you've created a project and installed dependencies with `pnpm install`, to start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Local Database Development

## Prerequisites

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install [DataGrip](https://www.jetbrains.com/datagrip/) (optional, for database monitoring)

## Setup Steps

### 1. Start Docker Container

Download [Docker Desktop Here](https://www.docker.com/products/docker-desktop/)

```bash
# Run PostgreSQL container
docker run --name hungrystack \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=hungrystack \
  -v /var/lib/postgresql/data:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d postgres:latest
```

![Docker Container Settings](./assets/docker1.png)

### 2. Database Setup

```bash
# Start PostgreSQL service
sudo service postgresql start

# Access PostgreSQL CLI
sudo -u postgres psql

# Create database
postgres=# CREATE DATABASE hungrystack;

# Set password
postgres=# ALTER USER postgres WITH PASSWORD 'postgres';
```

### 3. Schema Management with Drizzle

Check out [Drizzle Migration Guide](https://orm.drizzle.team/docs/kit-overview#how-to-migrate-to-0210)

```bash
# Generate migrations
pnpm drizzle-kit generate

# Push changes to database
pnpm drizzle-kit push
```

### 4. Database Monitoring

1. Open DataGrip (jetbrains toolbox)
2. Add new PostgreSQL data source
3. Configure connection:
   - Host: localhost
   - Port: 5432
   - Database: hungrystack
   - User: postgres
   - Password: postgres

![Datagrip Settings](./assets/datagrip1.png)
![Datagrip Settings](./assets/datagrip2.png)

### Environment Variables

See .envexample for differences in using neon DATABASE_URL and local DATABASE_URL
Create `.env` file with:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hungrystack
```
