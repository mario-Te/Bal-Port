"use strict";
const { verify } = require("jsonwebtoken");
const ResponseHelper = require("../helpers/ResponseHelper");
const User = require("../models/Users");
const Variables = require("../config/constant");

module.exports = {
  verifyToken: (expectedRoles) => {
    return async (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(403).json({ responseCode: 403, success: false });
      }
      const headerParts = req.headers.authorization.split(" ");
      const prefix = headerParts[0];
      const token = headerParts[1];
      if (prefix !== "Bearer" || !token) {
        return res.status(403).json({ responseCode: 403, success: false });
      }
      let decoded = "";
      try {
        decoded = verify(token, process.env.JWT_TOKEN_SECRET);
      } catch (error) {
        return res.status(403).json({ responseCode: 403, success: false });
      }
      const role = decoded.role;
      let id = (await User.findOne({ name: decoded.name }))._id;
      if (!role) {
        return res.status(403).json({ responseCode: 403, success: false });
      }
      if (role && expectedRoles.some((scope) => role.indexOf(scope) !== -1)) {
        req.id = id;
        if (role) {
          req.role = role;
        }

        // check if user still exists in db
        if (role == Variables.R) {
          const user = await User.findOne({ _id: req.id });
          if (!user || (user && user.deleted == true)) {
            return res.status(403).json({ responseCode: 403, success: false });
          } else {
            req.user = user;
          }
        }

        next();
      } else {
        return res
          .status(200)
          .json(
            ResponseHelper.badResponse(
              "you don't have permission to do this operation!!"
            )
          );
      }
    };
  },
};
