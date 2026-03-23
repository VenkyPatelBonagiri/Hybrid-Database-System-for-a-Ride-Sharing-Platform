-- RIDE SHARING SYSTEM DATABASE
-- Schema

-- CREATE DATABASE
CREATE DATABASE ride_sharing_system2;
USE ride_sharing_system2;


-- 1. USERS TABLE (PASSENGERS)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2. DRIVERS TABLE
CREATE TABLE drivers (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.0,
    status ENUM('available','busy','offline') DEFAULT 'offline'
);


-- 3. VEHICLES TABLE
CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT,
    vehicle_model VARCHAR(100),
    license_plate VARCHAR(20) UNIQUE,
    capacity INT,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
);


-- 4. TRIPS TABLE
CREATE TABLE trips (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    driver_id INT,
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    trip_status ENUM('requested','ongoing','completed','cancelled'),
    fare_amount DECIMAL(10,2),
    trip_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
);


-- 5. PAYMENTS TABLE
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT,
    payment_method ENUM('cash','card','wallet'),
    payment_status ENUM('pending','completed','failed'),
    amount DECIMAL(10,2),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (trip_id) REFERENCES trips(trip_id)
);


-- 6. RATINGS TABLE
CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT,
    user_id INT,
    driver_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review TEXT,

    FOREIGN KEY (trip_id) REFERENCES trips(trip_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
);




-- INDEXES
CREATE INDEX idx_trip_user
ON trips(user_id);

CREATE INDEX idx_trip_driver
ON trips(driver_id);

CREATE INDEX idx_payment_trip
ON payments(trip_id);