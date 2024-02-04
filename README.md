# asp-team33
Agile software project UoL course

### Dev environment
To run the backend:
```bash
cd backend
# run postgres database
docker build -t postgres ./
docker run --net=host --name local-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=admin -d postgres
# run api
npm start
```

Api docs are available under `http://localhost:8000/api-docs`

To enter PostgresQL within the docker, run:
```bash
docker exec -it local-postgres psql -U admin -d api
```

To start the server run:
```bash
cd BookSwapApp
npx expo start
```