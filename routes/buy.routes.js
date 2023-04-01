const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, allowedDocs } = require("../middleware");
const {
  productExistById,
  invoiceExistById,
  itemExistById,
} = require("../helpers/db-validators");

const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
} = require("../controllers/invoice.controller");

const {
  getItems,
  updateItem,
} = require("../controllers/invoiceDetails.controller");

const router = Router();

router.get("/", getInvoices);

router.post(
  "/",
  [
    check("car", "max of different products is 10").isArray({ max: 10 }),
    check("car.*.product", "product is mandatory").not().isEmpty(),
    check("car.*.product", "is not a mongoID").isMongoId(),
    check("car.*.product").custom(productExistById),
    check("car.*.quantity", "max quantity is 7").isInt({ max: 7 }),
    validateJWT,
    validateFields,
  ],
  createInvoice
);

router.put(
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(invoiceExistById),
    validateJWT,
    allowedDocs,
    validateFields,
  ],
  updateInvoice
);

router.get(
  "/:invoiceId/items",
  [
    check("invoiceId", "is not a mongoID").isMongoId(),
    check("invoiceId").custom(invoiceExistById),
    validateFields,
  ],
  getItems
);

router.put(
  "/:invoiceId/items/:itemId",
  [
    check("invoiceId", "is not a mongoID").isMongoId(),
    check("invoiceId").custom(invoiceExistById),
    check("itemId").isMongoId(),
    check("itemId").custom(itemExistById),
    validateFields,
  ],
  updateItem
);
module.exports = router;
