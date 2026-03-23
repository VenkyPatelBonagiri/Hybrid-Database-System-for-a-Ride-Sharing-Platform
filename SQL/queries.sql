
-- BASIC SELECT QUERIES

SELECT * FROM users;
SELECT * FROM drivers;
SELECT * FROM vehicles;
SELECT * FROM trips;
SELECT * FROM payments;
SELECT * FROM ratings;


-- UPDATE QUERIES

UPDATE drivers
SET status='busy'
WHERE driver_id=1;

UPDATE trips
SET trip_status='completed'
WHERE trip_id=1;



-- DELETE QUERY

DELETE FROM ratings
WHERE rating_id=2;



-- JOIN QUERY (Passenger + Driver + Trip)

SELECT
t.trip_id,
u.full_name AS passenger,
d.full_name AS driver,
t.pickup_location,
t.dropoff_location,
t.fare_amount
FROM trips t
JOIN users u ON t.user_id = u.user_id
JOIN drivers d ON t.driver_id = d.driver_id;



-- AGGREGATION QUERIES

-- Total trips per driver
SELECT driver_id, COUNT(trip_id) AS total_trips
FROM trips
GROUP BY driver_id;


-- Total system revenue
SELECT SUM(amount) AS total_revenue
FROM payments
WHERE payment_status='completed';


-- Average driver rating
SELECT driver_id, AVG(rating) AS avg_rating
FROM ratings
GROUP BY driver_id;



-- FILTER QUERIES

-- Trips with fare greater than 20
SELECT *
FROM trips
WHERE fare_amount > 20;



-- BUSINESS ANALYTICS QUERY

-- Most active passenger
SELECT user_id, COUNT(trip_id) AS total_rides
FROM trips
GROUP BY user_id
ORDER BY total_rides DESC
LIMIT 1;



-- TRIP + PAYMENT REPORT

SELECT
t.trip_id,
u.full_name AS passenger,
d.full_name AS driver,
p.amount,
p.payment_status
FROM trips t
JOIN users u ON t.user_id = u.user_id
JOIN drivers d ON t.driver_id = d.driver_id
JOIN payments p ON t.trip_id = p.trip_id;


-- FULL TRIP DETAILS REPORT

SELECT 
    t.trip_id,
    u.full_name AS passenger_name,
    d.full_name AS driver_name,
    t.pickup_location,
    t.dropoff_location,
    t.fare_amount,
    t.trip_status,
    t.trip_date
FROM trips t
JOIN users u 
    ON t.user_id = u.user_id
JOIN drivers d 
    ON t.driver_id = d.driver_id;


