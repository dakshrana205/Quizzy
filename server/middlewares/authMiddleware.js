const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    
    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }

    // Set the user object in the request
    req.user = user;
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).send({
      message: "You are not authenticated",
      data: error,
      success: false,
    });
  }
};
