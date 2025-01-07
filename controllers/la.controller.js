const La = require("../models/la.model");

const indexLa = async (req, res) => {
  try {
    const { size = 10, current = 1 } = req.query;
    const skip = (current - 1) * size;

    const [total, las] = await Promise.all([
      La.countDocuments(),
      La.find({}).skip(skip).limit(parseInt(size)),
    ]);

    const totalPages = Math.ceil(total / size);

    res.status(200).json({
      code: 200,
      status: "Ok",
      data: las,
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

const showLa = async (req, res) => {
  try {
    const { id } = req.params;

    const la = await La.findById(id).lean();

    if (!la) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "Resource not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "Ok",
      data: la,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const storeLa = async (req, res) => {
  try {
    const laData = req.body;

    const la = await La.create(laData);

    res.status(201).json({
      code: 201,
      status: "Created",
      data: la,
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

const updateLa = async (req, res) => {
  try {
    const { id } = req.params;
    const laData = req.body;

    const updatedLa = await La.findByIdAndUpdate(
      { _id: id },
      { $set: laData },
      { new: true }
    );

    if (!updatedLa) {
      return res.status(404).json({
        code: 404,
        status: "Not Found",
        message: "Resource not found",
      });
    }

    res.status(201).json({
      code: 201,
      status: "Created",
      data: updatedLa,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "Internal Server Error",
      message: error.message,
    });
  }
};

const deleteLa = async (req, res) => {
  try {
    const { id } = req.params;

    const la = await La.findByIdAndDelete(id);

    if (!la) {
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
  indexLa,
  showLa,
  storeLa,
  updateLa,
  deleteLa,
};
