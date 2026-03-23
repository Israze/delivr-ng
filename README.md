# delivr-ng 🚚

A free, open-source REST API for estimating delivery fees across Nigerian cities using real logistics providers.

Built for Nigerian developers building food delivery, ecommerce, and logistics applications.

---

## Base URL
```
https://delivr-ng.onrender.com
```

---

## Endpoints

### Health Check
```
GET /
```

### Cities & States
```
GET /api/cities                  → all 37 states + FCT
GET /api/cities/:code            → single state with all LGAs
```

**Example:**
```
GET /api/cities/LA
```
```json
{
  "data": {
    "id": 1,
    "name": "Lagos",
    "code": "LA",
    "lgas": [
      { "id": 1, "name": "Ikeja", "latitude": 6.6018, "longitude": 3.3515 },
      ...
    ]
  }
}
```

---

### Providers
```
GET /api/providers               → all providers
GET /api/providers?city=lagos    → providers by city
GET /api/providers/:id           → single provider
```

**Example:**
```
GET /api/providers/kwik
```
```json
{
  "data": {
    "id": "kwik",
    "name": "Kwik Delivery",
    "vehicle_types": ["bike", "car"],
    "base_fare": 400,
    "per_km_rate": 100,
    "cities": ["lagos"]
  }
}
```

---

### Estimate
```
GET /api/estimate?from=&to=&state_code=&vehicle=
```

| Param | Required | Description |
|-------|----------|-------------|
| `from` | ✅ | Origin LGA name |
| `to` | ✅ | Destination LGA name |
| `state_code` | ✅ | State code e.g `LA`, `AB`, `FC` |
| `vehicle` | ❌ | Filter by vehicle type: `bike`, `car`, `van`, `truck` |

**Example:**
```
GET /api/estimate?from=Ikeja&to=Surulere&state_code=LA
```
```json
{
  "data": {
    "from": "Ikeja",
    "to": "Surulere",
    "state_code": "LA",
    "distance_km": 11.12,
    "estimates": [
      {
        "provider": "Kwik Delivery",
        "provider_id": "kwik",
        "vehicle_types": ["bike", "car"],
        "fee_range": {
          "min": 1361,
          "max": 1663,
          "currency": "NGN"
        }
      }
    ],
    "note": "Estimates are approximate. Actual price may vary by provider."
  }
}
```

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| All endpoints | 100 requests / 15 minutes |
| `/api/estimate` | 10 requests / 1 minute |

---

## State Codes

| State | Code |
|-------|------|
| Abia | AB |
| Adamawa | AD |
| Akwa Ibom | AK |
| Anambra | AN |
| Bauchi | BA |
| Bayelsa | BY |
| Benue | BE |
| Borno | BO |
| Cross River | CR |
| Delta | DE |
| Ebonyi | EB |
| Edo | ED |
| Ekiti | EK |
| Enugu | EN |
| FCT | FC |
| Gombe | GO |
| Imo | IM |
| Jigawa | JI |
| Kaduna | KD |
| Kano | KN |
| Katsina | KT |
| Kebbi | KB |
| Kogi | KO |
| Kwara | KW |
| Lagos | LA |
| Nasarawa | NA |
| Niger | NI |
| Ogun | OG |
| Ondo | ON |
| Osun | OS |
| Oyo | OY |
| Plateau | PL |
| Rivers | RI |
| Sokoto | SO |
| Taraba | TA |
| Yobe | YO |
| Zamfara | ZA |

---

## Contributing

Contributions are welcome! If you notice incorrect provider rates or missing data:

1. Fork the repo
2. Update the data
3. Submit a pull request

---

## License

MIT — free to use in personal and commercial projects.

---

Built with ❤️ for Nigerian developers by [thegreaterdev](https://github.com/Israze)