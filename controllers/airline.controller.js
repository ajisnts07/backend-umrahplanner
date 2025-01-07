const Airline = require('../models/airline.model');

const indexAirline = async (req, res) => {
  try {
    const { size = 10, current = 1 } = req.query;
    const skip = (current - 1) * size;

    const [total, airlines] = await Promise.all([Airline.countDocuments(), Airline.find({}).skip(skip).limit(parseInt(size))]);

    const totalPages = Math.ceil(total / size);

    res.status(200).json({
      code: 200,
      status: 'Ok',
      data: airlines,
      page: {
        size: parseInt(size),
        total: total,
        totalPages: totalPages,
        current: parseInt(current),
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

const showAirline = async (req, res) => {
  try {
    const { id } = req.params;

    const airline = await Airline.findById(id).lean();

    if (!airline) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Resource not found',
      });
    }

    res.status(200).json({
      code: 200,
      status: 'Ok',
      data: airline,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

const storeAirline = async (req, res) => {
  try {
    const airlineData = req.body;

    const airline = await Airline.create(airlineData);

    res.status(201).json({
      code: 201,
      status: 'Created',
      data: airline,
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

const updateAirline = async (req, res) => {
  try {
    const { id } = req.params;
    const airlineData = req.body;

    const updatedAirline = await Airline.findByIdAndUpdate({ _id: id }, { $set: airlineData }, { new: true });

    if (!updatedAirline) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Resource not found',
      });
    }

    res.status(201).json({
      code: 201,
      status: 'Created',
      data: updatedAirline,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

const deleteAirline = async (req, res) => {
  try {
    const { id } = req.params;

    const airline = await Airline.findByIdAndDelete(id);

    if (!airline) {
      return res.status(404).json({
        code: 404,
        status: 'Not Found',
        message: 'Resource not found',
      });
    }

    res.status(204).json({
      code: 204,
      status: 'No Content',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: error.message,
    });
  }
};

module.exports = {
  indexAirline,
  showAirline,
  storeAirline,
  updateAirline,
  deleteAirline,
};
