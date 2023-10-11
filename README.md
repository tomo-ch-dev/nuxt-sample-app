# Nuxt 3 Minimal Starter
Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup
Start the Docker container for the database:
```
docker-compose up -d
```

Make sure to install the dependencies:
```
npm install
```

Execute the database migrations:
```
npm run migration:run
```

## Development Server
Start the development server on `http://localhost:3000`
```
npm run dev
```
