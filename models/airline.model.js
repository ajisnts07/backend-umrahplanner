const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama Maskapai wajib diisi'],
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Kode Maskapai wajib diisi'],
      unique: true,
      minLength: [2, 'Kode Maskapai minimal 2 karakter'],
      maxLength: [6, 'Kode Maskapai minimal 2 karakter'],
    },
    country: {
      type: String,
      required: false,
    },
    flightClasses: {
      type: String,
      required: [true, 'Kelas Maskapai wajib diisi'],
      enum: ['Economy', 'Business'],
    },
    airlinePrice: {
      type: Number,
      required: [true, 'Harga wajib diisi'],
      min: [0, 'Harga harus lebih besar dari 0'],
    },
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

const Airline = mongoose.model('Airline', airlineSchema);

module.exports = Airline;
