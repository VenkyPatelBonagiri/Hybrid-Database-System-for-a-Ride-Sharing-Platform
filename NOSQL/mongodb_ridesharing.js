// =============================================
// RIDE SHARING SYSTEM - MongoDB Script
// Module: M605 - Advanced Databases
// =============================================


// =============================================
// 1. SELECT / CREATE DATABASE
// =============================================
use ride_sharing_nosql;


// =============================================
// 2. CREATE COLLECTIONS
// =============================================
db.createCollection("trip_locations");
db.createCollection("driver_activity");
db.createCollection("ride_logs");
db.createCollection("reviews");


// =============================================
// 3. CREATE INDEXES FOR PERFORMANCE
// =============================================
db.trip_locations.createIndex({ trip_id: 1 });
db.trip_locations.createIndex({ driver_id: 1 });

db.driver_activity.createIndex({ driver_id: 1 });

db.ride_logs.createIndex({ trip_id: 1 });

db.reviews.createIndex({ trip_id: 1 });
db.reviews.createIndex({ driver_id: 1 });


// =============================================
// 4. INSERT INTO trip_locations
// GPS tracking data with embedded arrays
// =============================================
db.trip_locations.insertMany([
  {
    trip_id: 1,
    driver_id: 1,
    locations: [
      { latitude: 52.5200, longitude: 13.4050, timestamp: new Date("2024-01-01T10:00:00Z") },
      { latitude: 52.5220, longitude: 13.4080, timestamp: new Date("2024-01-01T10:05:00Z") },
      { latitude: 52.5250, longitude: 13.4120, timestamp: new Date("2024-01-01T10:10:00Z") }
    ]
  },
  {
    trip_id: 2,
    driver_id: 2,
    locations: [
      { latitude: 52.5100, longitude: 13.3900, timestamp: new Date("2024-01-01T11:00:00Z") },
      { latitude: 52.5130, longitude: 13.3940, timestamp: new Date("2024-01-01T11:06:00Z") },
      { latitude: 52.5160, longitude: 13.3980, timestamp: new Date("2024-01-01T11:12:00Z") }
    ]
  },
  {
    trip_id: 3,
    driver_id: 3,
    locations: [
      { latitude: 52.5300, longitude: 13.4200, timestamp: new Date("2024-01-02T09:00:00Z") },
      { latitude: 52.5320, longitude: 13.4240, timestamp: new Date("2024-01-02T09:08:00Z") }
    ]
  },
  {
    trip_id: 4,
    driver_id: 4,
    locations: [
      { latitude: 52.5400, longitude: 13.4300, timestamp: new Date("2024-01-02T14:00:00Z") },
      { latitude: 52.5420, longitude: 13.4340, timestamp: new Date("2024-01-02T14:05:00Z") },
      { latitude: 52.5450, longitude: 13.4380, timestamp: new Date("2024-01-02T14:11:00Z") },
      { latitude: 52.5470, longitude: 13.4420, timestamp: new Date("2024-01-02T14:17:00Z") }
    ]
  },
  {
    trip_id: 5,
    driver_id: 5,
    locations: [
      { latitude: 52.5000, longitude: 13.3800, timestamp: new Date("2024-01-03T08:30:00Z") },
      { latitude: 52.5020, longitude: 13.3850, timestamp: new Date("2024-01-03T08:36:00Z") }
    ]
  }
]);


// =============================================
// 5. INSERT INTO driver_activity
// Driver status updates with embedded arrays
// =============================================
db.driver_activity.insertMany([
  {
    driver_id: 1,
    driver_name: "David Miller",
    activity_log: [
      { status: "online",  timestamp: new Date("2024-01-01T08:00:00Z") },
      { status: "busy",    timestamp: new Date("2024-01-01T10:00:00Z") },
      { status: "online",  timestamp: new Date("2024-01-01T10:30:00Z") },
      { status: "offline", timestamp: new Date("2024-01-01T18:00:00Z") }
    ]
  },
  {
    driver_id: 2,
    driver_name: "Michael Brown",
    activity_log: [
      { status: "online",  timestamp: new Date("2024-01-01T09:00:00Z") },
      { status: "busy",    timestamp: new Date("2024-01-01T11:00:00Z") },
      { status: "online",  timestamp: new Date("2024-01-01T11:40:00Z") },
      { status: "offline", timestamp: new Date("2024-01-01T20:00:00Z") }
    ]
  },
  {
    driver_id: 3,
    driver_name: "Ahmed Hassan",
    activity_log: [
      { status: "online",  timestamp: new Date("2024-01-02T07:00:00Z") },
      { status: "busy",    timestamp: new Date("2024-01-02T09:00:00Z") },
      { status: "offline", timestamp: new Date("2024-01-02T16:00:00Z") }
    ]
  },
  {
    driver_id: 4,
    driver_name: "Linda Nguyen",
    activity_log: [
      { status: "online",  timestamp: new Date("2024-01-02T12:00:00Z") },
      { status: "busy",    timestamp: new Date("2024-01-02T14:00:00Z") },
      { status: "online",  timestamp: new Date("2024-01-02T15:00:00Z") },
      { status: "offline", timestamp: new Date("2024-01-02T22:00:00Z") }
    ]
  },
  {
    driver_id: 5,
    driver_name: "Carlos Reyes",
    activity_log: [
      { status: "online",  timestamp: new Date("2024-01-03T06:00:00Z") },
      { status: "busy",    timestamp: new Date("2024-01-03T08:30:00Z") },
      { status: "offline", timestamp: new Date("2024-01-03T14:00:00Z") }
    ]
  }
]);


// =============================================
// 6. INSERT INTO ride_logs
// Lifecycle events: requested → assigned → started → completed
// =============================================
db.ride_logs.insertMany([
  {
    trip_id: 1,
    user_id: 1,
    driver_id: 1,
    events: [
      { event: "ride_requested", timestamp: new Date("2024-01-01T09:58:00Z") },
      { event: "driver_assigned", timestamp: new Date("2024-01-01T10:00:00Z") },
      { event: "ride_started",   timestamp: new Date("2024-01-01T10:02:00Z") },
      { event: "ride_completed", timestamp: new Date("2024-01-01T10:30:00Z") }
    ]
  },
  {
    trip_id: 2,
    user_id: 2,
    driver_id: 2,
    events: [
      { event: "ride_requested", timestamp: new Date("2024-01-01T10:55:00Z") },
      { event: "driver_assigned", timestamp: new Date("2024-01-01T11:00:00Z") },
      { event: "ride_started",   timestamp: new Date("2024-01-01T11:03:00Z") },
      { event: "ride_completed", timestamp: new Date("2024-01-01T11:40:00Z") }
    ]
  },
  {
    trip_id: 3,
    user_id: 3,
    driver_id: 3,
    events: [
      { event: "ride_requested", timestamp: new Date("2024-01-02T08:58:00Z") },
      { event: "driver_assigned", timestamp: new Date("2024-01-02T09:00:00Z") },
      { event: "ride_started",   timestamp: new Date("2024-01-02T09:02:00Z") },
      { event: "ride_cancelled", timestamp: new Date("2024-01-02T09:05:00Z") }
    ]
  },
  {
    trip_id: 4,
    user_id: 4,
    driver_id: 4,
    events: [
      { event: "ride_requested", timestamp: new Date("2024-01-02T13:58:00Z") },
      { event: "driver_assigned", timestamp: new Date("2024-01-02T14:00:00Z") },
      { event: "ride_started",   timestamp: new Date("2024-01-02T14:03:00Z") },
      { event: "ride_completed", timestamp: new Date("2024-01-02T15:00:00Z") }
    ]
  },
  {
    trip_id: 5,
    user_id: 5,
    driver_id: 5,
    events: [
      { event: "ride_requested", timestamp: new Date("2024-01-03T08:28:00Z") },
      { event: "driver_assigned", timestamp: new Date("2024-01-03T08:30:00Z") },
      { event: "ride_started",   timestamp: new Date("2024-01-03T08:32:00Z") },
      { event: "ride_completed", timestamp: new Date("2024-01-03T09:10:00Z") }
    ]
  }
]);


// =============================================
// 7. INSERT INTO reviews
// Passenger feedback with tags
// =============================================
db.reviews.insertMany([
  {
    trip_id: 1,
    user_id: 1,
    driver_id: 1,
    rating: 5,
    comment: "Excellent ride! Very professional and on time.",
    tags: ["clean", "professional", "on-time"]
  },
  {
    trip_id: 2,
    user_id: 2,
    driver_id: 2,
    rating: 4,
    comment: "Smooth ride, driver was friendly.",
    tags: ["friendly", "smooth"]
  },
  {
    trip_id: 4,
    user_id: 4,
    driver_id: 4,
    rating: 3,
    comment: "Average experience, car was a bit old.",
    tags: ["average"]
  },
  {
    trip_id: 5,
    user_id: 5,
    driver_id: 5,
    rating: 5,
    comment: "Amazing driver, very safe and comfortable.",
    tags: ["safe", "comfortable", "professional"]
  },
  {
    trip_id: 1,
    user_id: 1,
    driver_id: 1,
    rating: 4,
    comment: "Good experience overall.",
    tags: ["good"]
  }
]);


// =============================================
// 8. BASIC SELECT (FIND) QUERIES
// =============================================

// View all trip_locations
db.trip_locations.find().pretty();

// View all driver_activity
db.driver_activity.find().pretty();

// View all ride_logs
db.ride_logs.find().pretty();

// View all reviews
db.reviews.find().pretty();


// =============================================
// 9. FILTER QUERIES
// =============================================

// Find all GPS data for a specific trip
db.trip_locations.find({ trip_id: 1 }).pretty();

// Find all activity for a specific driver
db.driver_activity.find({ driver_id: 2 }).pretty();

// Find ride logs for a specific trip
db.ride_logs.find({ trip_id: 3 }).pretty();

// Find reviews with rating of 5
db.reviews.find({ rating: 5 }).pretty();

// Find reviews with rating greater than or equal to 4
db.reviews.find({ rating: { $gte: 4 } }).pretty();

// Find reviews containing specific tag
db.reviews.find({ tags: "professional" }).pretty();


// =============================================
// 10. PROJECTION QUERIES (select specific fields)
// =============================================

// Show only driver_id and comment from reviews (exclude _id)
db.reviews.find({}, { driver_id: 1, comment: 1, rating: 1, _id: 0 }).pretty();

// Show only driver_name and current status from driver_activity
db.driver_activity.find({}, { driver_name: 1, activity_log: 1, _id: 0 }).pretty();


// =============================================
// 11. AGGREGATION QUERIES
// =============================================

// Average rating per driver
db.reviews.aggregate([
  {
    $group: {
      _id: "$driver_id",
      average_rating: { $avg: "$rating" },
      total_reviews: { $sum: 1 }
    }
  },
  { $sort: { average_rating: -1 } }
]);

// Count of rides per user from ride_logs
db.ride_logs.aggregate([
  {
    $group: {
      _id: "$user_id",
      total_rides: { $sum: 1 }
    }
  },
  { $sort: { total_rides: -1 } }
]);

// Count total GPS location points recorded per trip
db.trip_locations.aggregate([
  {
    $project: {
      trip_id: 1,
      total_points: { $size: "$locations" }
    }
  }
]);

// Most common review tags across the platform
db.reviews.aggregate([
  { $unwind: "$tags" },
  {
    $group: {
      _id: "$tags",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]);

// Number of events per trip from ride_logs
db.ride_logs.aggregate([
  {
    $project: {
      trip_id: 1,
      total_events: { $size: "$events" }
    }
  }
]);


// =============================================
// 12. UPDATE QUERIES
// =============================================

// Update: add a new GPS location point to an existing trip
db.trip_locations.updateOne(
  { trip_id: 1 },
  {
    $push: {
      locations: {
        latitude: 52.5270,
        longitude: 13.4150,
        timestamp: new Date("2024-01-01T10:15:00Z")
      }
    }
  }
);

// Update: change a driver's latest status to offline
db.driver_activity.updateOne(
  { driver_id: 1 },
  {
    $push: {
      activity_log: {
        status: "offline",
        timestamp: new Date("2024-01-01T19:00:00Z")
      }
    }
  }
);

// Update: add a new event to a ride log
db.ride_logs.updateOne(
  { trip_id: 2 },
  {
    $push: {
      events: {
        event: "payment_received",
        timestamp: new Date("2024-01-01T11:45:00Z")
      }
    }
  }
);

// Update: correct a review rating
db.reviews.updateOne(
  { trip_id: 4, user_id: 4 },
  { $set: { rating: 4, comment: "Updated: Better than expected." } }
);


// =============================================
// 13. DELETE QUERIES
// =============================================

// Delete a specific review
db.reviews.deleteOne({ trip_id: 5, user_id: 5 });

// Delete all GPS data for a cancelled trip
db.trip_locations.deleteOne({ trip_id: 3 });


// =============================================
// 14. COUNT DOCUMENTS
// =============================================
db.trip_locations.countDocuments();
db.driver_activity.countDocuments();
db.ride_logs.countDocuments();
db.reviews.countDocuments();


// =============================================
// 15. SORTING AND LIMITING
// =============================================

// Top 3 highest-rated reviews
db.reviews.find().sort({ rating: -1 }).limit(3).pretty();

// Most recent ride log entry
db.ride_logs.find().sort({ "events.timestamp": -1 }).limit(1).pretty();


// =============================================
// 16. ADVANCED QUERY - $elemMatch
// Find trips where a specific event occurred in events array
// =============================================
db.ride_logs.find({
  events: { $elemMatch: { event: "ride_cancelled" } }
}).pretty();

// Find trips that have a GPS point above a specific latitude
db.trip_locations.find({
  locations: { $elemMatch: { latitude: { $gt: 52.5400 } } }
}).pretty();
