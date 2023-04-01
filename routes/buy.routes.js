const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, hasRole } = require("../middleware");
const { productExistById } = require("../helpers/db-validators");
const { Invoice } = require("../models");

const {
  getInvoices,
  getInvoiceById,
  createInvoice,
} = require("../controllers/invoice.controller");

const router = Router();

router.get("/", getInvoices);

router.post(
  "/",
  [
    check("car", "max of different products is 10").isArray({ max: 10 }),
    check("car.*.product", "product is mandatory").not().isEmpty(),
    check("car.*.product", "is not a mongoID").isMongoId(),
    check("car.*.product").custom(productExistById),
    check("car.*.quantity", "max quantity is 7").isInt({max:7}),
    validateFields,
  ],
  createInvoice
);

module.exports = router;
