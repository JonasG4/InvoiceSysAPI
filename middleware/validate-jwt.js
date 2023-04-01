const { request, response } = require("express");

const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;
const { User, Invoice } = require("../models/");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) return res.status(401).json({ msg: "Token does not exist" });
  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    if (!user)
      return res
        .status(401)
        .json({ msg: "Token not valid: User does not exist" });

    if (!user.status)
      return res.status(401).json({ msg: "Token not valid: status - false" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Token not valid" });
  }
};

const allowedDocs = async (req = request, res = response, next) => {
  const { id } = req.params;
  const token = req.header("x-token");

  const invoice = await Invoice.findById(id);
  const { uid } = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findById(uid);

  if (user.role === "ADMIN_ROLE") return next();

  const userInvoiceId = invoice.user.toString();

  if (uid != userInvoiceId) {
    return res.status(403).json({ msg: "This content is not allowed" });
  } else {
    next();
  }
};

module.exports = {
  validateJWT,
  allowedDocs,
};
