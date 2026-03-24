# ============================================
# HYBRID DATABASE INTEGRATION SCRIPT
# Ride-Sharing System
# SQL + MongoDB Integration
# ============================================

import mysql.connector
from pymongo import MongoClient
from datetime import datetime, timezone


# ============================================
# CONNECT TO MYSQL DATABASE
# ============================================

mysql_conn = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="root123",
    database="ride_sharing_system2"
)

mysql_cursor = mysql_conn.cursor(dictionary=True)

print("Connected to MySQL database")


# ============================================
# CONNECT TO MONGODB
# ============================================

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["ride_sharing_nosql"]

trip_locations_collection = mongo_db["trip_locations"]
ride_logs_collection = mongo_db["ride_logs"]

print("Connected to MongoDB")


# ============================================
# FUNCTION: FETCH TRIP FROM SQL
# ============================================

def fetch_trip(trip_id):

    query = """
    SELECT trip_id, user_id, driver_id,
           pickup_location, dropoff_location,
           fare_amount
    FROM trips
    WHERE trip_id = %s
    """

    mysql_cursor.execute(query, (trip_id,))
    result = mysql_cursor.fetchone()

    return result


# ============================================
# FUNCTION: STORE GPS TRACKING IN MONGODB
# ============================================

def store_trip_location(trip_id, driver_id):

    location_data = {
        "trip_id": trip_id,
        "driver_id": driver_id,
        "locations": [
            {"lat": 28.6139, "lon": 77.2090, "timestamp": datetime.now(timezone.utc)},
            {"lat": 28.6145, "lon": 77.2102, "timestamp": datetime.now(timezone.utc)}
        ],
        "created_at": datetime.now(timezone.utc)
    }

    trip_locations_collection.insert_one(location_data)

    print(f"GPS tracking stored for trip {trip_id}")


# ============================================
# FUNCTION: STORE RIDE EVENT LOG
# ============================================

def log_ride_event(trip_id):

    log_data = {
        "trip_id": trip_id,
        "events": [
            {"event": "ride_requested", "time": datetime.now(timezone.utc)},
            {"event": "driver_assigned", "time": datetime.now(timezone.utc)},
            {"event": "ride_started", "time": datetime.now(timezone.utc)}
        ]
    }

    ride_logs_collection.insert_one(log_data)

    print(f"Ride event log stored for trip {trip_id}")


# ============================================
# MAIN HYBRID WORKFLOW
# ============================================

def process_trip(trip_id):

    trip = fetch_trip(trip_id)

    if trip:

        print("Trip fetched from SQL:")
        print(trip)

        driver_id = trip["driver_id"]

        # Store GPS tracking in MongoDB
        store_trip_location(trip_id, driver_id)

        # Store ride event logs
        log_ride_event(trip_id)

    else:
        print("Trip not found in SQL database")


# ============================================
# RUN DEMO
# ============================================

if __name__ == "__main__":

    test_trip_id = 1

    process_trip(test_trip_id)

    print("Hybrid SQL + MongoDB workflow completed")