# mlsa-website 🏗️

# development

1. Setup env

```sh
cp .env.example .env
```

2. Run postgres container

```sh
docker compose up -d
```

3. Run next server

```sh
pnpm dev
```

4. Admin dashboard is located at [https://localhost:3000/admin](https://localhost:3000/admin)

5. Go to admin dashboard and create your own user for local development. (will add a seed script later once we have a few collections to work on)
