const mongoose = require('mongoose');

const railwaySchema = new mongoose.Schema({
  trains: [{
    trainNumber: { type: String, required: true },
    trainType: { type: String, enum: ['Express', 'Local', 'Freight', 'High-Speed'], default: 'Express' },
    capacity: { type: Number, required: true, min: 0 },
    amenities: [String]
  }],

  stations: [{
    name: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v) => v.length === 2,
          message: 'Coordinates must be [longitude, latitude]'
        }
      }
    }
  }],

  routes: [{
    routeNumber: { type: String, required: true },
    startStation: { type: String, required: true },
    endStation: { type: String, required: true },
    stops: [String],
    distance: { type: Number, required: true, min: 0 }
  }],

  schedules: [{
    train: { type: String, required: true },
    route: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    status: { type: String, enum: ['On Time', 'Delayed', 'Cancelled'], default: 'On Time' }
  }]
});

// Create indexes for frequently queried fields
railwaySchema.index({ 'trains.trainNumber': 1 });
railwaySchema.index({ 'stations.name': 1 });
railwaySchema.index({ 'routes.routeNumber': 1 });
railwaySchema.index({ 'schedules.departureTime': 1 });

// Create the model
const Railway = mongoose.model('Railway', railwaySchema);

module.exports = Railway;