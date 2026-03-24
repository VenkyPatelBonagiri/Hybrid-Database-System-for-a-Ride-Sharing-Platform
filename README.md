# Ride Sharing Hybrid Database System

A hybrid database system for a ride-sharing platform built using **MySQL** and **MongoDB**, connected through a **Python** integration layer.

**Module:** M605 – Advanced Databases | Gisma University of Applied Sciences

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| SQL Database | MySQL | Users, drivers, trips, payments, ratings |
| NoSQL Database | MongoDB | GPS tracking, ride logs, driver activity, reviews |
| Integration | Python | Connects both databases as one system |

---

## Project Structure

```
RideSharing-Hybrid-Database/
├── SQL/
│   ├── schema.sql          # CREATE TABLE + indexes
│   ├── SampleData.sql     # INSERT statements (named + bulk 100+ records)
│   ├── queries.sql         # SELECT, JOIN, aggregation queries
│   ├── procedures.sql      # Stored procedures
│   └── triggers.sql        # Triggers
├── NOSQL/
│   └── mongodb_ridesharing.js  # Collections + CRUD + aggregation
├── python/
│   ├── database_sync.py    # MySQL ↔ MongoDB integration
│   └── requirements.txt    # Python dependencies
└── README.md
```

---

## How to Run

### 1. MySQL Setup
Open MySQL Workbench and run the files in this order:
```
schema.sql → sample_data.sql → queries.sql → procedures.sql → triggers.sql
```

### 2. MongoDB Setup
Open MongoDB Shell and run:
```
mongodb_queries.js
```

### 3. Python Setup
```bash
pip install -r python/requirements.txt
```

Update the MySQL password in `database_sync.py` line 18:
```python
password="your_password"
```

### 4. Run Integration
```bash
python3 python/database_sync.py
```

---

## What the Integration Does

1. Connect to both MySQL and MongoDB.
2. Fetch trip details (for `trip_id: 1`) from MySQL.
3. Insert dummy real-time GPS coordinates into MongoDB's `trip_locations` collection.
4. Insert ride lifecycle tracking events into MongoDB's `ride_logs` collection.


---

## Author

Venky Patel Bonagiri(GH1044508)
