# indo-airports-api

This is a simple API for getting information about airports in Indonesia. Includes airport name, city, province, IATA code, and ICAO code.

This API is built using [Express](https://expressjs.com/) and [Node.js](https://nodejs.org/en/).

API data is still in development. So, the airport data is not complete yet.

## Data

The data is taken from [Wikipedia](https://en.wikipedia.org/wiki/List_of_airports_in_Indonesia). with some modifications.

Data is stored on [Firestore](https://firebase.google.com/docs/firestore) database.

You can also see the data in indo-aiports.json file on /data folder.

## API Endpoint Documentation and Usage

Request and response format is in raw JSON.

### Welcome message

```
GET /
```

### Get all airports

```
GET /airports
```

### Get airport by IATA code

```
GET /airports/iata/:iata
```

### Get airport by ICAO code

```
GET /airports/icao/:icao
```

### Post single airport

```
POST /airports
```

### Post multiple airports (bulk)

```
POST /airports/bulk
```

### Update airport by IATA code

```
PUT /airports/iata/:iata
```

### Update airport by ICAO code

```
PUT /airports/icao/:icao
```

### Patch airport by IATA code

```
PATCH /airports/iata/:iata
```

### Patch airport by ICAO code

```
PATCH /airports/icao/:icao
```

### Delete airport by IATA code

```
DELETE /airports/iata/:iata
```

### Delete airport by ICAO code

```
DELETE /airports/icao/:icao
```

## License

MIT License
