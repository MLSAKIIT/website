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

4. Seed your database

```sh
pnpm seed
```

5. Admin dashboard is located at [https://localhost:3000/admin](https://localhost:3000/admin)
