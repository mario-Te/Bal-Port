const User = require("../models/Users");
const ResponseHelper = require("../helpers/ResponseHelper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Variables = require("../config/constant");

module.exports = {
  registerUser: async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
      let user = await User.findOne({ name });
      if (user) {
        return res
          .status(400)
          .json(ResponseHelper.badResponse("Username is Duplicated"));
      }
      user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json(ResponseHelper.badResponse("Email is Duplicated"));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        phone,
        email,
        password: hashedPassword,
      });
      const accessToken = jwt.sign(
        { name: user.name, role: user.role },
        process.env.JWT_TOKEN_SECRET
      );
      // Save the new user to the database
      await newUser.save();

      return res.status(200).json(
        ResponseHelper.successResponse({
          token: accessToken,
          user: {
            email: newUser.email,
            name: newUser.name,
          },
        })
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json(ResponseHelper.badResponse(err));
    }
  },
  LoginUser: async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
      // Check if user exists by email
      let user = await User.findOne({ email: emailOrUsername });

      // If user does not exist by email, check by username
      if (!user) {
        user = await User.findOne({ username: emailOrUsername });
      }

      if (!user) {
        return res
          .status(400)
          .json(ResponseHelper.badResponse("Invalid credentials"));
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res
          .status(400)
          .json(ResponseHelper.badResponse("Invalid credentials"));
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        { name: user.name, role: user.role },
        process.env.JWT_TOKEN_SECRET
      );

      return res.status(200).json(
        ResponseHelper.successResponse({
          token: accessToken,
          user: {
            email: user.email,
            name: user.name,
          },
        })
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json(ResponseHelper.badResponse(err));
    }
  },
};
