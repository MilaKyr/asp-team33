# Welcome to the Book Swap Application repository

## Final application walkthrough

[![Book Swap walkthrough](https://img.youtube.com/vi/mgGzQRS8a18/hqdefault.jpg)](https://youtu.be/mgGzQRS8a18)


Press play to see the video.


## Commit progression

[![Commit history](https://img.youtube.com/vi/Hg_TXn_e5hs/hqdefault.jpg)](https://youtu.be/Hg_TXn_e5hs)

Press play to see the video.

## Depoyment
Deployment specifications can be found in the final report


### Dev environment
To run the backend api:
```bash
cd backend
# run postgres database
docker build -t postgres ./
docker run --net=host --name local-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=main -d postgres

#run js script to fill database with sample data
npm run seed-db
# run api
npm run start
```

Api docs are available under `http://localhost:8000/api-docs` or `https://asp-team33.onrender.com/api-docs`

To enter PostgresQL within the docker, run:
```bash
docker exec -it local-postgres psql -U main -d api
```

### Sample data
The file is under `data/users.json`


### Tests
To run tests:
```bash
npm test
```
Test info also can be found in `data/tests/tests_output.txt`


To check test coverage:
```bash
npm run coverage
```
Coverage can be found also on the server under either `http://localhost:8000/coverage` or `https://asp-team33.onrender.com/coverage`

To start the React Native app run:
```bash
cd BookSwapApp
npx expo start
```