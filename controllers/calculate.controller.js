const Hotel = require('../models/hotel.model');
const Setting = require('../models/setting.model');
const Visa = require('../models/visa.model');
const La = require('../models/la.model');
const Airline = require('../models/airline.model');
const { currencyRate } = require('../middlewares/currency.middleware');

const calculate = async (req, res) => {
  try {
    const { idHotelMakkah, nightInMakkah, idHotelMadinah, nightInMadinah, countVisa, visaPrice, idAirline } = req.body;
    let roomRatesMakkah = [];
    let ratesPerPersonMakkah = [];
    let roomRatesMadinah = [];
    let ratesPerPersonMadinah = [];
    const totalRatesHotelSar = [];
    const totalRatesHotelUsd = [];
    const totalRatesSettingUsd = [];
    const totalRatesSettingIdr = [];
    let usdToSar, usdToIdr, priceVisa, localOffice, focTl, b2b, b2c;
    const totalNets = [];
    const focUstads = [];
    const focTls = [];
    const totalPrices = [];
    const b2bs = [];
    const b2cs = [];

    const fetchCalculate = async () => {
      const makkahPromise = Hotel.findById(idHotelMakkah).lean();
      const madinahPromise = Hotel.findById(idHotelMadinah).lean();
      const settingPromise = Setting.find().lean();
      const visaPromise = Visa.findOne({ countVisa: countVisa }).lean();
      const laPromise = La.findOne({ countLa: countVisa }).lean();
      const airlinePromise = Airline.findById(idAirline).lean();

      return Promise.all([makkahPromise, madinahPromise, settingPromise, visaPromise, laPromise, airlinePromise]);
    };

    const [hotelMakkah, hotelMadinah, setting, visa, la, airline] = await fetchCalculate();

    if (!hotelMakkah || !hotelMadinah) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Resource not found',
      });
    } else {
      hotelMakkah.roomPrices.forEach((hotel) => {
        if (nightInMakkah === undefined) {
          return res.status(404).json({
            code: 400,
            status: 'Bad Request',
            message: 'Isi Malam terlebih dahulu',
          });
        } else {
          const ratePerPersonMakkah = Math.round((hotel.price * nightInMakkah) / (hotel.roomType === 'Quad' ? 4 : hotel.roomType === 'Triple' ? 3 : 2));

          if ((req.body && Array.isArray(req.body.roomRatesMakkah)) || Array.isArray(req.body.ratesPerPersonMakkah)) {
            roomRatesMakkah = req.body.roomRatesMakkah;
            ratesPerPersonMakkah = req.body.ratesPerPersonMakkah;
          } else {
            roomRatesMakkah.push({
              roomType: hotel.roomType,
              price: hotel.price,
            });
            ratesPerPersonMakkah.push({
              roomType: hotel.roomType,
              price: ratePerPersonMakkah,
            });
          }
        }
      });

      hotelMadinah.roomPrices.forEach((hotel) => {
        if (nightInMadinah === undefined) {
          return res.status(404).json({
            code: 400,
            status: 'Bad Request',
            message: 'Isi Malam terlebih dahulu',
          });
        } else {
          const ratePerPersonMadinah = Math.round((hotel.price * nightInMadinah) / (hotel.roomType === 'Quad' ? 4 : hotel.roomType === 'Triple' ? 3 : 2));

          if ((req.body && Array.isArray(req.body.roomRatesMadinah)) || Array.isArray(req.body.ratesPerPersonMadinah)) {
            roomRatesMadinah = req.body.roomRatesMadinah;
            ratesPerPersonMadinah = req.body.ratesPerPersonMadinah;
          } else {
            roomRatesMadinah.push({
              roomType: hotel.roomType,
              price: hotel.price,
            });
            ratesPerPersonMadinah.push({
              roomType: hotel.roomType,
              price: ratePerPersonMadinah,
            });
          }
        }
      });

      ratesPerPersonMakkah.forEach((makkahRoom) => {
        const madinahRoom = ratesPerPersonMadinah.find((madinahRoom) => {
          return madinahRoom.roomType === makkahRoom.roomType;
        });
        const totalRates = madinahRoom ? makkahRoom.price + madinahRoom.price : makkahRoom.price;

        totalRatesHotelSar.push({
          roomType: makkahRoom.roomType,
          price: totalRates,
        });
      });
    }

    if (totalRatesHotelSar !== 0) {
      const fetchCurrency = async () => {
        const idrPromise = currencyRate('USD', 'IDR');
        const sarPromise = currencyRate('USD', 'SAR');

        const [sarRate, idrRate] = await Promise.all([sarPromise, idrPromise]);

        if (setting !== null) {
          if (req.body && req.body.usdToSar && req.body.usdToIdr) {
            usdToSar = req.body.usdToSar;
            usdToIdr = req.body.usdToIdr;
          } else if (req.body && req.body.usdToSar) {
            usdToSar = req.body.usdToSar;
            usdToIdr = idrRate !== null ? parseFloat(Math.floor(parseFloat(idrRate) * 1000).toFixed(3)) : setting[0].usdToIdr;
          } else if (req.body && req.body.usdToIdr) {
            usdToSar = sarRate !== null ? sarRate / 100 : setting[0].usdToSar;
            usdToIdr = req.body.usdToIdr;
          } else {
            usdToSar = sarRate !== null ? sarRate / 100 : setting[0].usdToSar;
            usdToIdr = idrRate !== null ? parseFloat(Math.floor(parseFloat(idrRate) * 1000).toFixed(3)) : setting[0].usdToIdr;
          }
        } else {
          return res.status(404).json({
            code: 404,
            status: 'Not Found',
            message: 'Resource not found',
          });
        }
      };

      await fetchCurrency();

      totalRatesHotelSar.forEach((total) => {
        const totalRateHotelUsd = Math.ceil(total.price / usdToSar);

        totalRatesHotelUsd.push({
          roomType: total.roomType,
          price: totalRateHotelUsd,
        });
      });

      totalRatesHotelUsd.forEach((total) => {
        priceVisa = req.body && req.body.visaPrice ? Number(req.body.visaPrice) : Number(visa.visaPrice);

        const totalRateSettingUsd = total.price + priceVisa + la.laPrice;
        const totalRateSettingIdr = Math.round(totalRateSettingUsd * usdToIdr);

        totalRatesSettingUsd.push({
          roomType: total.roomType,
          price: totalRateSettingUsd,
        });
        totalRatesSettingIdr.push({
          roomType: total.roomType,
          price: totalRateSettingIdr,
        });
      });

      totalRatesSettingIdr.forEach((total) => {
        let totalNet = total.price + airline.airlinePrice;

        if (req.body && req.body.localOffice > 0) {
          totalNet += req.body.localOffice;
          localOffice = req.body.localOffice;
        } else {
          localOffice = setting[0].localOffice;
          totalNet += setting[0].localOffice;
        }

        totalNets.push({
          roomType: total.roomType,
          price: totalNet,
        });
      });

      totalNets.forEach((total) => {
        const focUstad = Math.round(total.price / (countVisa === '30' ? 30 : countVisa === '20' ? 20 : countVisa === '15' ? 15 : countVisa === '10' ? 10 : 0));

        focUstads.push({
          roomType: total.roomType,
          price: focUstad,
        });

        focTl = req.body.focTl;

        if (req.body && focTl === 0) {
          focTls.push({
            roomType: total.roomType,
            price: focTl,
          });
        } else {
          focTls.push({
            roomType: total.roomType,
            price: focUstad,
          });
        }
      });

      totalNets.forEach((total) => {
        const { roomType, price: amount } = total;
        const existingCost = totalPrices.find((cost) => cost.roomType === roomType);

        if (existingCost) {
          existingCost.total += amount;
        } else {
          totalPrices.push({
            roomType: total.roomType,
            price: amount,
          });
        }
      });

      focUstads.forEach((foc) => {
        const { roomType, price: amount } = foc;
        const existingCost = totalPrices.find((cost) => cost.roomType === roomType);

        if (existingCost) {
          existingCost.price += amount;
        } else {
          totalPrices.push({
            roomType: foc.roomType,
            price: amount,
          });
        }
      });

      focTls.forEach((foc) => {
        const { roomType, price: amount } = foc;
        const existingCost = totalPrices.find((cost) => cost.roomType === roomType);

        if (existingCost) {
          existingCost.price += amount;
        } else {
          totalPrices.push({
            roomType: foc.roomType,
            price: amount,
          });
        }
      });

      totalPrices.forEach((total) => {
        const feeB2b = Math.round(total.price + setting[0].b2b);

        b2b = req.body.b2b;

        if (req.body && b2b > 0) {
          const finalB2b = Math.round(total.price + b2b);

          b2bs.push({
            roomType: total.roomType,
            price: finalB2b,
          });
        } else {
          b2bs.push({
            roomType: total.roomType,
            price: feeB2b,
          });

          b2b = setting[0].b2b;
        }
      });

      b2bs.forEach((b2b) => {
        const feeB2c = Math.round(b2b.price + setting[0].b2c);
        b2c = req.body.b2c;

        if (req.body && b2c > 0) {
          const finalB2c = Math.round(b2b.price + b2c);

          b2cs.push({
            roomType: b2b.roomType,
            price: finalB2c,
          });
        } else {
          b2cs.push({
            roomType: b2b.roomType,
            price: feeB2c,
          });

          b2c = setting[0].b2c;
        }
      });
    } else {
      res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: errors.join(', '),
      });
    }

    res.status(201).json({
      code: 201,
      status: 'Created',
      data: {
        hotelMakkah: hotelMakkah,
        nightInMakkah: nightInMakkah,
        ratesHotelMakkah: hotelMakkah.roomPrices,
        ratesPerPersonMakkah: ratesPerPersonMakkah,
        hotelMadinah: hotelMadinah,
        nightInMadinah: nightInMadinah,
        ratesHotelMadinah: hotelMadinah.roomPrices,
        ratesPerPersonMadinah: ratesPerPersonMadinah,
        totalRatesHotelSar: totalRatesHotelSar,
        totalRatesHotelUsd: totalRatesHotelUsd,
        countVisa: countVisa,
        priceVisa: priceVisa,
        countLa: countVisa,
        priceLa: la.laPrice,
        totalRatesSettingUsd: totalRatesSettingUsd,
        totalRatesSettingIdr: totalRatesSettingIdr,
        airline: airline.name,
        codeAirline: airline.code,
        priceAirline: airline.airlinePrice,
        localOffice: localOffice,
        totalNets: totalNets,
        countFocUstad: countVisa,
        focUstads: focUstads,
        countFocTl: countVisa,
        focTls: focTls,
        b2b: b2b,
        b2bs: b2bs,
        b2c: b2c,
        b2cs: b2cs,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);

      res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: errors.join(', '),
      });
    } else {
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: error.message,
      });
    }
  }
};

module.exports = { calculate };
