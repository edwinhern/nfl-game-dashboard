# API Curl Commands

## Sync Endpoints

### Test Sync
```bash
curl --request GET \
  --url http://localhost:8080/api/sync/testSync \
  --header 'User-Agent: insomnia/10.0.0'
```

### Next Sync
```bash
curl --request GET \
  --url http://localhost:8080/api/sync/nextSync \
  --header 'User-Agent: insomnia/10.0.0'
```

## Games Endpoints

### Get Stadiums
```bash
curl --request GET \
  --url http://localhost:8080/api/games/stadiums \
  --header 'User-Agent: insomnia/10.0.0'
```

### Get Teams
```bash
curl --request GET \
  --url http://localhost:8080/api/games/teams \
  --header 'User-Agent: insomnia/10.0.0'
```

### Get Games (with date range)
```bash
curl --request GET \
  --url 'http://localhost:8080/api/games/?startDate=2024-11-10T18%3A00%3A00.000Z&endDate=2024-11-25T01%3A25%3A00.000Z' \
  --header 'User-Agent: insomnia/10.0.0'
```

### Get Games (with date range - duplicate)
```bash
curl --request GET \
  --url 'http://localhost:8080/api/games/?startDate=2024-11-10T18%3A00%3A00.000Z&endDate=2024-11-25T01%3A25%3A00.000Z' \
  --header 'User-Agent: insomnia/10.0.0'
```