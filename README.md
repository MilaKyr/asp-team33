# asp-team33
Agile software project UoL course

TO run postgres database:
```bash
docker build -t postgres ./
docker run --net=host --name local-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=admin -d postgres
```

To enter PostgresQL within the docker, run:
```bash
docker exec -it local-postgres psql -U admin -d api
```

To start the server run:
```bash
cd BookSwapApp
npx expo start
```