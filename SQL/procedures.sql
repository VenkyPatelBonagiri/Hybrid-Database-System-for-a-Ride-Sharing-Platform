
USE ride_sharing_system2;

DELIMITER $$

-- PROCEDURE 1: Book a New Trip
-- Registers a new trip request for a passenger and automatically sets driver status to 'busy'

CREATE PROCEDURE BookTrip(IN p_user_id INT, IN p_driver_id INT, IN p_pickup VARCHAR(255), IN p_dropoff VARCHAR(255), IN p_fare DECIMAL(10,2))
BEGIN
    -- Insert the new trip
    INSERT INTO trips (user_id, driver_id, pickup_location, dropoff_location, trip_status, fare_amount)
    VALUES (p_user_id, p_driver_id, p_pickup, p_dropoff, 'requested', p_fare);

    -- Mark the driver as busy
    UPDATE drivers
    SET status = 'busy'
    WHERE driver_id = p_driver_id;

    -- Return the newly created trip
    SELECT
        LAST_INSERT_ID()   AS new_trip_id,
        p_user_id          AS user_id,
        p_driver_id        AS driver_id,
        p_pickup           AS pickup_location,
        p_dropoff          AS dropoff_location,
        'requested'        AS trip_status,
        p_fare             AS fare_amount;
END$$


-- PROCEDURE 2: Complete a Trip
-- Marks trip as completed, processes payment,
-- and sets driver back to available

CREATE PROCEDURE CompleteTrip(IN p_trip_id INT, IN p_payment_method ENUM('cash','card','wallet'))
BEGIN
    DECLARE v_fare DECIMAL(10,2);

    -- Get the fare amount for this trip
    SELECT fare_amount INTO v_fare
    FROM trips
    WHERE trip_id = p_trip_id;

    -- Update trip status to completed
    UPDATE trips
    SET trip_status = 'completed'
    WHERE trip_id = p_trip_id;

    -- Insert payment record
    INSERT INTO payments (trip_id, payment_method, payment_status, amount)
    VALUES (p_trip_id, p_payment_method, 'completed', v_fare);

    -- Set driver back to available
    UPDATE drivers
    SET status = 'available'
    WHERE driver_id = (
        SELECT driver_id FROM trips WHERE trip_id = p_trip_id
    );

    SELECT CONCAT('Trip ', p_trip_id, ' completed. Payment of €', v_fare, ' recorded.') AS result;
END$$



-- PROCEDURE 3: Get Driver Summary Report
-- Returns full stats for a specific driver:
-- total trips, total earnings, average rating

CREATE PROCEDURE GetDriverReport(IN p_driver_id INT)
BEGIN
    SELECT
        d.driver_id,
        d.full_name                         AS driver_name,
        d.status                            AS current_status,
        d.rating                            AS stored_rating,
        COUNT(DISTINCT t.trip_id)           AS total_trips,
        COALESCE(SUM(p.amount), 0)          AS total_earnings,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
    FROM drivers d
    LEFT JOIN trips    t ON d.driver_id = t.driver_id
    LEFT JOIN payments p ON t.trip_id   = p.trip_id AND p.payment_status = 'completed'
    LEFT JOIN ratings  r ON d.driver_id = r.driver_id
    WHERE d.driver_id = p_driver_id
    GROUP BY d.driver_id, d.full_name, d.status, d.rating;
END$$



-- PROCEDURE 4: Get Platform Analytics
-- Returns a full business overview:
-- total users, drivers, trips, and revenue

CREATE PROCEDURE GetPlatformAnalytics()
BEGIN
    SELECT
        (SELECT COUNT(*) FROM users)                                    AS total_users,
        (SELECT COUNT(*) FROM drivers)                                  AS total_drivers,
        (SELECT COUNT(*) FROM trips)                                    AS total_trips,
        (SELECT COUNT(*) FROM trips WHERE trip_status = 'completed')    AS completed_trips,
        (SELECT COUNT(*) FROM trips WHERE trip_status = 'cancelled')    AS cancelled_trips,
        (SELECT COALESCE(SUM(amount), 0)
         FROM payments WHERE payment_status = 'completed')              AS total_revenue,
        (SELECT COALESCE(ROUND(AVG(amount), 2), 0)
         FROM payments WHERE payment_status = 'completed')              AS avg_fare,
        (SELECT COALESCE(ROUND(AVG(rating), 2), 0)
         FROM ratings)                                                  AS platform_avg_rating;
END$$


-- PROCEDURE 5: Cancel a Trip
-- Cancels a trip and frees the driver
-- Only allows cancellation if trip is 'requested'
CREATE PROCEDURE CancelTrip(IN p_trip_id INT)
BEGIN
    DECLARE v_status VARCHAR(20);
    DECLARE v_driver_id INT;

    -- Get current trip status and driver
    SELECT trip_status, driver_id
    INTO v_status, v_driver_id
    FROM trips
    WHERE trip_id = p_trip_id;

    -- Only cancel if still in 'requested' state
    IF v_status = 'requested' THEN
        UPDATE trips
        SET trip_status = 'cancelled'
        WHERE trip_id = p_trip_id;

        UPDATE drivers
        SET status = 'available'
        WHERE driver_id = v_driver_id;

        SELECT CONCAT('Trip ', p_trip_id, ' has been cancelled. Driver is now available.') AS result;

    ELSE
        SELECT CONCAT('Cannot cancel trip ', p_trip_id, '. Current status: ', v_status) AS result;
    END IF;
END$$


DELIMITER ;


-- CALL PROCEDURES

CALL BookTrip(1, 3, 'Train Station', 'Hotel Berlin', 22.00);
CALL CompleteTrip(102, 'card');
CALL GetDriverReport(1);
CALL GetPlatformAnalytics();
CALL CancelTrip(1);
CALL BookTrip(2, 4, 'Airport', 'City Centre', 30.00);
CALL CancelTrip(LAST_INSERT_ID());