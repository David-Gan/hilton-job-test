# Tech Requirements
-  Use Node.js stack to complete this test √
-  Data should be persisted to a NoSQL database √
-  Build RESTful Endpoints √
-  Build GraphQL Endpoints √
-  Unit-test code √
-  A SPA (Single Page Application) to interact with the backend and show how the API works. √

# Bouns Requirements
-  Solution for building and deploying the project √
-  Basic Authentication √
-  Couchbase √
-  cucumber √
-  Docker √
-  GraphQL √
-  Loopback √
-  React √
-  TypeScript √

# Demo

- online demo http://8.130.32.70:8000/
- Employee Account Email: admin@admin.com
- Employee Account Password: password (password is the password)

# Summary

- ./backend is the api server
- ./frontend is the web client
- ./docker-compose

## Backend

- Used Loopback to build the api server of Rest and GraphQL
- Used CouchBase to store the data
- Used Ottoman as ORM component since there is no office connector for Couchbase and LoopBack
- ./backend/src/__tests__ is the test folder

### install backend

1. cd ./backend
2. cp .env.default to .env and update
3. yarn
4. yarn dev
5. yarn test (will clear db)

## Frontend

- Used Vite & React to build the web client
- MUI is used to build the UI
- axios is used to make the api calls
- Apollo GraphQL Client is used to make the graphql calls

### run frontend
1. cd ./frontend
2. cp .env.default to .env and update
3. yarn
4. yarn dev

# More

If this is a production project, I have some options to make it better.

1. Use a CDN to host the frontend builed files
2. Use playwright to run the e2e tests for the frontend
3. Use redis to cache the request data on Backend
4. Use nestjs to replace Loopback, it has a more robust open-source ecosystem
5. Use kubernetes to deploy Backend
