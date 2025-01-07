const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama Hotel wajib diisi'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: [true, 'Kota wajib diisi'],
      enum: ['Makkah', 'Madinah'],
    },
    location: {
      type: String,
      required: [true, 'Lokasi Hotel wajib diisi'],
    },
    address: {
      type: String,
      required: [true, 'Alamat wajib diisi'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating minimal 1'],
      max: [5, 'Rating maksimal 5'],
    },
    amenities: [
      {
        type: String,
        enum: ['Non-smoking rooms', 'Room Service', '2 Restaurants', 'Free Wifi', 'Family Rooms', '24-hour front desk', 'Elevator', 'Air Conditioning', 'Tea/Coffe Maker in All Rooms', 'Breakfast'],
      },
    ],
    roomPrices: [
      {
        _id: false,
        roomType: {
          type: String,
          required: [true, 'Tipe Kamar wajib diisi'],
          enum: ['Quad', 'Triple', 'Double'],
        },
        price: {
          type: Number,
          required: [true, 'Harga wajib diisi'],
          min: [0, 'Harga harus lebih besar dari 0'],
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    id: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const Hotel = mongoose.model('hotels', hotelSchema);

module.exports = Hotel;
