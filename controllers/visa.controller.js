const Visa = require("../models/visa.model");

const indexVisa = async (req, res) => {
  try {
    const { size = 10, current = 1 } = req.query;
    const skip = (current - 1) * size;

    const [total, visas] = await Promise.all([
      Visa.countDocuments(),
      Visa.find({}).skip(skip).limit(parseInt(size)),
    ]);

    const totalPages = Math.ceil(total / size);

    res.status(200).json({
      code: 200,
      status: "Ok",
      data: visas,
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
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const showVisa = async (req, res) => {
  try {
    const { id } = req.params;

    const visa = await Visa.findById(id).lean();

    if (!visa) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "Resource not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "Ok",
      data: visa,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const storeVisa = async (req, res) => {
  try {
    const visaData = req.body;

    const visa = await Visa.create(visaData);

    res.status(201).json({
      code: 201,
      status: "Created",
      data: visa,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);

      res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: errors.join(", "),
      });
    } else {
      res.status(500).json({
        code: 500,
        status: "Internal Server Error",
        message: error.message,
      });
    }
  }
};

const updateVisa = async (req, res) => {
  try {
    const { id } = req.params;
    const visaData = req.body;

    const updatedVisa = await Visa.findByIdAndUpdate(
      { _id: id },
      { $set: visaData },
      { new: true }
    );

    if (!updatedVisa) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "Resource not found",
      });
    }

    res.status(201).json({
      code: 201,
      status: "Created",
      data: updatedVisa,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const deleteVisa = async (req, res) => {
  try {
    const { id } = req.params;

    const visa = await Visa.findByIdAndDelete(id);

    if (!visa) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "Resource not found",
      });
    }

    res.status(204).json({
      code: 204,
      status: "No Content",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

module.exports = {
  indexVisa,
  showVisa,
  storeVisa,
  updateVisa,
  deleteVisa,
};
