const mongoose = require('mongoose');

const laSchema = new mongoose.Schema(
  {
    countLa: {
      type: Number,
      required: [true, 'Jumlah (count) wajib diisi'],
      enum: [10, 15, 20, 30],
      unique: [true, 'Jumlah sudah ada'],
      validate: {
        validator: function (value) {
          return [10, 15, 20, 30].includes(value);
        },
        message: (props) => `${props.value} adalah jumlah yang tidak valid!`,
      },
    },
    laPrice: {
      type: Number,
      required: [true, 'Harga wajib diisi'],
      min: [0, 'Harga harus lebih besar dari 0'],
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

const La = mongoose.model('las', laSchema);

module.exports = La;
