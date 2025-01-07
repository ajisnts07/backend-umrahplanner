const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    usdToSar: {
      type: Number,
      required: [true, 'Dollar ke SAR wajib diisi'],
      min: [0, 'Dollar ke SAR harus lebih besar dari 0'],
    },
    usdToRupiah: {
      type: Number,
      required: [true, 'Dollar ke Rupiah wajib diisi'],
      min: [0, 'Dollar ke Rupiah harus lebih besar dari 0'],
    },
    localOffice: {
      type: Number,
      required: [true, 'Lokal Kantor wajib diisi'],
      min: [0, 'Lokal Kantor harus lebih besar dari 0'],
    },
    b2b: {
      type: Number,
      required: [true, 'Fee MBU B2B wajib diisi'],
      min: [0, 'Fee MBU B2B harus lebih besar dari 0'],
    },
    b2c: {
      type: Number,
      required: [true, 'Fee MBU B2C wajib diisi'],
      min: [0, 'Fee MBU B2C harus lebih besar dari 0'],
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

const Setting = mongoose.model('settings', settingSchema);

module.exports = Setting;
