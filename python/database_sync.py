# =============================================
# RIDE SHARING SYSTEM
# Hybrid Database Integration Script
# Module: M605 - Advanced Databases
# File: hybrid_integration.py
# =============================================
# This script connects MySQL (SQL) and MongoDB (NoSQL)
# as a single hybrid system. It reads structured trip
# data from MySQL and writes operational ride data
# (GPS tracking, ride logs) into MongoDB.
# =============================================

import mysql.connector
from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# =============================================
# 1. DATABASE CONNECTION - MySQL
# =============================================
def connect_mysql():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root123",   # Replace with your MySQL password
            database="ride_sharing_system2"
        )
        print("[MySQL] Connection successful.")
        return connection
    except mysql.connector.Error as e:
        print(f"[MySQL] Connection failed: {e}")
        return None


# =============================================
# 2. DATABASE CONNECTION - MongoDB
# =============================================
def connect_mongodb():
    try:
        client = MongoClient("mongodb://localhost:27017/")
        db = client["ride_sharing_nosql"]
        print("[MongoDB] Connection successful.")
        return db
    except Exception as e:
        print(f"[MongoDB] Connection failed: {e}")
        return None


# =============================================
# 3. FETCH TRIP DATA FROM MySQL
# =============================================
def fetch_trips_from_mysql(connection):
    cursor = connection.cursor(dictionary=True)
    query = """
        SELECT
            t.trip_id,
            t.user_id,
            t.driver_id,
            t.pickup_location,
            t.dropoff_location,
            t.fare_amount,
            t.trip_status,
            t.trip_date
        FROM trips t
        WHERE t.trip_status = 'completed'
        LIMIT 10
    """
    cursor.execute(query)
    trips = cursor.fetchall()
    cursor.close()
    print(f"[MySQL] Fetched {len(trips)} completed trips.")
    return trips


# =============================================
# 4. GENERATE SIMULATED GPS LOCATIONS
# Based on pickup/dropoff location names
# =============================================
def generate_gps_points(trip_id, driver_id, num_points=3):
    base_lat = 52.5200 + random.uniform(-0.05, 0.05)
    base_lon = 13.4050 + random.uniform(-0.05, 0.05)

    locations = []
    for i in range(num_points):
        locations.append({
            "latitude":  round(base_lat + i * 0.003, 6),
            "longitude": round(base_lon + i * 0.004, 6),
            "timestamp": datetime.utcnow() + timedelta(minutes=i * 5)
        })
    return locations


# =============================================
# 5. INSERT GPS DATA INTO MongoDB trip_locations
# =============================================
def insert_trip_locations(mongo_db, trips):
    collection = mongo_db["trip_locations"]
    inserted = 0

    for trip in trips:
        # Avoid duplicate entries on re-run
        existing = collection.find_one({"trip_id": trip["trip_id"]})
        if existing:
            print(f"[MongoDB] trip_locations: trip_id {trip['trip_id']} already exists, skipping.")
            continue

        gps_points = generate_gps_points(trip["trip_id"], trip["driver_id"])
        document = {
            "trip_id":   trip["trip_id"],
            "driver_id": trip["driver_id"],
            "locations": gps_points
        }
        collection.insert_one(document)
        inserted += 1

    print(f"[MongoDB] Inserted {inserted} documents into trip_locations.")


# =============================================
# 6. INSERT RIDE LIFECYCLE EVENTS INTO MongoDB ride_logs
# =============================================
def insert_ride_logs(mongo_db, trips):
    collection = mongo_db["ride_logs"]
    inserted = 0

    for trip in trips:
        existing = collection.find_one({"trip_id": trip["trip_id"]})
        if existing:
            print(f"[MongoDB] ride_logs: trip_id {trip['trip_id']} already exists, skipping.")
            continue

        base_time = trip["trip_date"] if trip["trip_date"] else datetime.utcnow()

        document = {
            "trip_id":   trip["trip_id"],
            "user_id":   trip["user_id"],
            "driver_id": trip["driver_id"],
            "events": [
                {
                    "event":     "ride_requested",
                    "timestamp": base_time
                },
                {
                    "event":     "driver_assigned",
                    "timestamp": base_time + timedelta(minutes=2)
                },
                {
                    "event":     "ride_started",
                    "timestamp": base_time + timedelta(minutes=5)
                },
                {
                    "event":     "ride_completed",
                    "timestamp": base_time + timedelta(minutes=30)
                }
            ]
        }
        collection.insert_one(document)
        inserted += 1

    print(f"[MongoDB] Inserted {inserted} documents into ride_logs.")


# =============================================
# 7. INSERT DRIVER ACTIVITY INTO MongoDB driver_activity
# =============================================
def insert_driver_activity(mongo_db, trips):
    collection = mongo_db["driver_activity"]
    inserted = 0

    seen_drivers = set()
    for trip in trips:
        driver_id = trip["driver_id"]
        if driver_id in seen_drivers:
            continue
        seen_drivers.add(driver_id)

        existing = collection.find_one({"driver_id": driver_id})
        if existing:
            print(f"[MongoDB] driver_activity: driver_id {driver_id} already exists, skipping.")
            continue

        base_time = trip["trip_date"] if trip["trip_date"] else datetime.utcnow()

        document = {
            "driver_id": driver_id,
            "activity_log": [
                {"status": "online",  "timestamp": base_time - timedelta(hours=1)},
                {"status": "busy",    "timestamp": base_time},
                {"status": "online",  "timestamp": base_time + timedelta(minutes=35)},
                {"status": "offline", "timestamp": base_time + timedelta(hours=6)}
            ]
        }
        collection.insert_one(document)
        inserted += 1

    print(f"[MongoDB] Inserted {inserted} documents into driver_activity.")


# =============================================
# 8. VERIFY DATA IN MongoDB
# Print counts of all collections
# =============================================
def verify_mongodb_data(mongo_db):
    print("\n--- MongoDB Collection Counts ---")
    collections = ["trip_locations", "driver_activity", "ride_logs", "reviews"]
    for name in collections:
        count = mongo_db[name].count_documents({})
        print(f"  {name}: {count} documents")


# =============================================
# 9. CROSS-DATABASE QUERY
# Fetch trip from MySQL + GPS from MongoDB together
# =============================================
def cross_database_report(connection, mongo_db):
    print("\n--- Hybrid Report: SQL Trip + MongoDB GPS ---")
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT trip_id, user_id, driver_id, fare_amount FROM trips LIMIT 5")
    trips = cursor.fetchall()
    cursor.close()

    for trip in trips:
        gps_doc = mongo_db["trip_locations"].find_one(
            {"trip_id": trip["trip_id"]},
            {"_id": 0, "locations": 1}
        )
        gps_count = len(gps_doc["locations"]) if gps_doc else 0
        print(
            f"  Trip {trip['trip_id']} | "
            f"User: {trip['user_id']} | "
            f"Driver: {trip['driver_id']} | "
            f"Fare: €{trip['fare_amount']} | "
            f"GPS Points: {gps_count}"
        )


# =============================================
# 10. MAIN - Run the full hybrid pipeline
# =============================================
def main():
    print("=" * 50)
    print("  Hybrid Database Integration - Ride Sharing")
    print("=" * 50)

    # Connect to both databases
    mysql_conn = connect_mysql()
    mongo_db   = connect_mongodb()

    if mysql_conn is None or mongo_db is None:
        print("Aborting: one or both database connections failed.")
        return

    # Step 1: Read from MySQL
    trips = fetch_trips_from_mysql(mysql_conn)

    if not trips:
        print("No trips found in MySQL. Make sure sample data is inserted.")
        mysql_conn.close()
        return

    # Step 2: Write to MongoDB
    insert_trip_locations(mongo_db, trips)
    insert_ride_logs(mongo_db, trips)
    insert_driver_activity(mongo_db, trips)

    # Step 3: Verify MongoDB state
    verify_mongodb_data(mongo_db)

    # Step 4: Cross-database report
    cross_database_report(mysql_conn, mongo_db)

    # Close MySQL connection
    mysql_conn.close()
    print("\n[MySQL] Connection closed.")
    print("\nHybrid integration completed successfully.")


# =============================================
# ENTRY POINT
# =============================================
if __name__ == "__main__":
    main()