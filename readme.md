#Setup

* Install postgres and postgis. `apt-get install postgres postgis`
* Create a database in postgres. `createdb a_database_name`
* Enable postgis extensions. `psql -d a_database_name -c "CREATE EXTENSION postgis;"`
* Initialize the database. `psql -d a_database_name < db/schema.sql`
* Copy `app/db/config/db.example.js` to `app/db/config/db.js` and modify to taste.

#API

```
POST /checkins
```

**Payload**
```js
{
  checkin: 
  { 
    coords:
    {
      accuracy: 25000,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: 18.806478,
      longitude: 98.94661500000001,
      speed: null
    },
    timezone: -7,
    landmark_id: 1,
    visibility: 50
  }
}
```
