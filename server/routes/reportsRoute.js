const authMiddleware = require("../middlewares/authMiddleware");
const Exam = require("../models/examModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const router = require("express").Router();

// add report

router.post("/add-report", authMiddleware, async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    const populatedReport = await Report.findById(newReport._id)
      .populate("exam")
      .populate("user");
    res.send({
      message: "Report added successfully",
      data: populatedReport,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports

router.post("/get-all-reports", authMiddleware, async (req, res) => {
  try {
    const { examName, userName } = req.body;
    let query = {};

    if (examName) {
      const exams = await Exam.find({ name: { $regex: examName, $options: 'i' } });
      const examIds = exams.map(exam => exam._id);
      query.exam = { $in: examIds };
    }

    if (userName) {
      const users = await User.find({ name: { $regex: userName, $options: 'i' } });
      const userIds = users.map(user => user._id);
      query.user = { $in: userIds };
    }

    const reports = await Report.find(query)
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });
      
    res.send({
      message: "Reports fetched successfully",
      data: reports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get all reports by user
router.post("/get-all-reports-by-user", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .populate("exam")
      .populate("user")
      .sort({ createdAt: -1 });
    res.send({
      message: "Reports fetched successfully",
      data: reports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

module.exports = router;
