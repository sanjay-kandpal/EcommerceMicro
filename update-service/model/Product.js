const mongoose = require('mongoose');

// Define the combined railway schema
const railwaySchema = new mongoose.Schema({
  trains: [{
    trainNumber: {
      type: String,
      required: [true, 'Train number is required'],
      unique: true,
      trim: true
    },
    trainType: {
      type: String,
      enum: ['Express', 'Local', 'Freight', 'High-Speed'],
      required: [true, 'Train type is required']
    },
    capacity: {
      type: Number,
      required: [true, 'Train capacity is required'],
      min: [0, 'Capacity must be a positive number']
    },
    amenities: {
      type: [String],
      default: []
    }
  }],
  stations: [{
    name: {
      type: String,
      required: [true, 'Station name is required'],
      unique: true,
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  }],
  routes: [{
    routeNumber: {
      type: String,
      required: [true, 'Route number is required'],
      unique: true,
      trim: true
    },
    startStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Start station is required']
    },
    endStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'End station is required']
    },
    stops: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station'
    }],
    distance: {
      type: Number,
      required: [true, 'Route distance is required'],
      min: [0, 'Distance must be a positive number']
    }
  }],
  schedules: [{
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: [true, 'Train is required']
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'Route is required']
    },
    departureTime: {
      type: Date,
      required: [true, 'Departure time is required']
    },
    arrivalTime: {
      type: Date,
      required: [true, 'Arrival time is required']
    },
    status: {
      type: String,
      enum: ['On Time', 'Delayed', 'Cancelled'],
      default: 'On Time'
    }
  }]
}, { timestamps: true });

// Create a model based on the schema
const Railway = mongoose.model('Railway', railwaySchema);

module.exports = Railway;
