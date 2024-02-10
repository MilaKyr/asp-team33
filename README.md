# asp-team33
Agile software project UoL course

### Sample data
The file is under `data/users.json`

### Dev environment
To run the backend api:
```bash
cd backend
# run postgres database
docker build -t postgres ./
docker run --net=host --name local-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=admin -d postgres

#run js script to fill database with sample data
npm run seed-db
# run api
npm run start
```

Api docs are available under `http://localhost:8000/api-docs`

To enter PostgresQL within the docker, run:
```bash
docker exec -it local-postgres psql -U admin -d api
```

To start the React Native app run:
```bash
cd BookSwapApp
npx expo start
```