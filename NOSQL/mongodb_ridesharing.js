// =======================================
// RIDE SHARING SYSTEM - MONGODB SCRIPT
// =======================================

// 1. CREATE / SWITCH DATABASE
use ride_sharing_nosql



// =======================================
// 2. COLLECTION: TRIP GPS LOCATIONS
// Stores route tracking for rides
// =======================================

db.trip_locations.insertOne({
 trip_id: 1,
 driver_id: 1,
 locations: [
   {lat: 28.6139, lon: 77.2090, timestamp: new Date()},
   {lat: 28.6145, lon: 77.2102, timestamp: new Date()}
 ],
 created_at: new Date()
})


// CREATE INDEX
db.trip_locations.createIndex({trip_id:1})
db.trip_locations.createIndex({driver_id:1})



// =======================================
// 3. COLLECTION: DRIVER ACTIVITY
// Tracks driver online/offline activity
// =======================================

db.driver_activity.insertOne({
 driver_id: 1,
 activity: [
   {status: "online", time: new Date()},
   {status: "busy", time: new Date()},
   {status: "offline", time: new Date()}
 ]
})


// CREATE INDEX
db.driver_activity.createIndex({driver_id:1})



// =======================================
// 4. COLLECTION: RIDE EVENT LOGS
// Stores ride lifecycle events
// =======================================

db.ride_logs.insertOne({
 trip_id: 1,
 events: [
  {event: "ride_requested", time: new Date()},
  {event: "driver_assigned", time: new Date()},
  {event: "ride_started", time: new Date()},
  {event: "ride_completed", time: new Date()}
 ]
})


// CREATE INDEX
db.ride_logs.createIndex({trip_id:1})



// =======================================
// 5. COLLECTION: REVIEWS
// Flexible ride feedback
// =======================================

db.reviews.insertOne({
 trip_id: 1,
 user_id: 1,
 driver_id: 1,
 rating: 5,
 review: "Excellent ride",
 tags: ["safe","comfortable","clean_car"],
 created_at: new Date()
})


// CREATE INDEX
db.reviews.createIndex({driver_id:1})
db.reviews.createIndex({rating:1})



// =======================================
// 6. READ QUERIES
// =======================================

// View trip locations
db.trip_locations.find().pretty()

// View driver activity
db.driver_activity.find().pretty()

// View ride logs
db.ride_logs.find().pretty()

// View reviews
db.reviews.find().pretty()



// =======================================
// 7. UPDATE QUERIES
// =======================================

// Update review rating
db.reviews.updateOne(
 {trip_id:1},
 {$set:{rating:4}}
)


// Add new GPS coordinate to trip
db.trip_locations.updateOne(
 {trip_id:1},
 {$push:{locations:{lat:28.6150,lon:77.2110,timestamp:new Date()}}}
)



// =======================================
// 8. DELETE QUERY
// =======================================

// Delete a review
db.reviews.deleteOne({trip_id:1})



// =======================================
// 9. FILTER QUERIES
// =======================================

// Find reviews for driver
db.reviews.find({driver_id:1})


// Find drivers with rating >=4
db.reviews.find({rating:{$gte:4}})



// =======================================
// 10. AGGREGATION QUERIES
// =======================================

// Average rating per driver
db.reviews.aggregate([
 {
  $group:{
   _id:"$driver_id",
   avg_rating:{$avg:"$rating"},
   total_reviews:{$sum:1}
  }
 }
])



// Trips tracked per driver
db.trip_locations.aggregate([
 {
  $group:{
   _id:"$driver_id",
   total_trips:{$sum:1}
  }
 }
])



// Most active drivers (based on logs)
db.ride_logs.aggregate([
 {
  $group:{
   _id:"$trip_id",
   events_count:{$sum:1}
  }
 },
 { $sort:{events_count:-1} }
])



// =======================================
// 11. GENERATE SAMPLE DATA (100+ RECORDS)
// =======================================

for (let i=1;i<=100;i++){

 db.reviews.insertOne({
   trip_id:i,
   user_id:Math.floor(Math.random()*50),
   driver_id:Math.floor(Math.random()*20),
   rating:Math.floor(Math.random()*5)+1,
   review:"Sample ride review",
   created_at:new Date()
 })

}



for (let i=1;i<=100;i++){

 db.trip_locations.insertOne({
   trip_id:i,
   driver_id:Math.floor(Math.random()*20),
   locations:[
     {lat:28.6139,lon:77.2090,timestamp:new Date()},
     {lat:28.6140,lon:77.2100,timestamp:new Date()}
   ],
   created_at:new Date()
 })

}