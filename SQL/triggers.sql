
USE ride_sharing_system2;

DELIMITER $$

-- TRIGGER 1: Auto-update driver rating
-- AFTER a new rating is inserted into ratings table, automatically recalculate and update that driver's
-- average rating in the drivers table

CREATE TRIGGER trg_update_driver_rating
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE drivers
    SET rating = (
        SELECT ROUND(AVG(rating), 2)
        FROM ratings
        WHERE driver_id = NEW.driver_id
    )
    WHERE driver_id = NEW.driver_id;
END$$


-- TRIGGER 2: Prevent booking a busy driver BEFORE a new trip is inserted, check if the driver is available.
-- If driver is 'busy' or 'offline', block the booking and raise an error message.

CREATE TRIGGER trg_check_driver_availability
BEFORE INSERT ON trips
FOR EACH ROW
BEGIN
    DECLARE v_status VARCHAR(20);

    SELECT status INTO v_status
    FROM drivers
    WHERE driver_id = NEW.driver_id;

    IF v_status != 'available' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Booking failed: Driver is not available.';
    END IF;
END$$


-- TRIGGER 3: Auto-update driver status on trip completion
-- AFTER a trip is updated to 'completed', automatically set the driver status back to 'available'
-- so they can accept new rides

CREATE TRIGGER trg_set_driver_available
AFTER UPDATE ON trips
FOR EACH ROW
BEGIN
    IF NEW.trip_status = 'completed' AND OLD.trip_status != 'completed' THEN
        UPDATE drivers
        SET status = 'available'
        WHERE driver_id = NEW.driver_id;
    END IF;
END$$


DELIMITER ;



-- TEST THE TRIGGERS
-- -----------------------------------------------
-- TEST TRIGGER 1: trg_update_driver_rating
-- Insert a new rating for driver 1
-- Then check if drivers.rating auto-updated
-- -----------------------------------------------

-- Check driver 1 rating BEFORE
SELECT driver_id, full_name, rating
FROM drivers
WHERE driver_id = 1;

-- Insert a new rating for driver 1
INSERT INTO ratings (trip_id, user_id, driver_id, rating, review)
VALUES (1, 1, 1, 3, 'Trigger test - average should update');

-- Check driver 1 rating AFTER (should be recalculated)
SELECT driver_id, full_name, rating
FROM drivers
WHERE driver_id = 1;


-- TEST TRIGGER 2: trg_check_driver_availability
-- First manually set driver 2 to 'busy'
-- Then try to book a trip with driver 2
-- Should raise: "Booking failed: Driver is not available."

-- Set driver 2 to busy
UPDATE drivers
SET status = 'busy'
WHERE driver_id = 2;

-- Try to book with busy driver 2 (this should FAIL with error)
INSERT INTO trips (user_id, driver_id, pickup_location, dropoff_location, trip_status, fare_amount)
VALUES (1, 2, 'Airport', 'City Center', 'requested', 20.00);



-- TEST TRIGGER 3: trg_set_driver_available
-- Book a trip with an available driver
-- Then complete the trip
-- Driver status should auto-change to 'available'


-- Make sure driver 3 is available first
UPDATE drivers
SET status = 'available'
WHERE driver_id = 3;

-- Check driver 3 status BEFORE
SELECT driver_id, full_name, status
FROM drivers
WHERE driver_id = 3;

-- Insert a new trip with driver 3
INSERT INTO trips (user_id, driver_id, pickup_location, dropoff_location, trip_status, fare_amount)
VALUES (1, 3, 'Hotel', 'Airport', 'requested', 18.00);

-- Get the trip_id just created
SELECT LAST_INSERT_ID() AS new_trip_id;

-- Complete the trip
UPDATE trips
SET trip_status = 'completed'
WHERE trip_id = 132;

-- Check driver 3 status AFTER (should now be 'available')
SELECT driver_id, full_name, status
FROM drivers
WHERE driver_id = 3;