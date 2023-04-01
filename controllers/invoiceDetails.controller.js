const { response, request } = require("express");
const { InvoiceDetails, Product, Invoice } = require("../models");

const getItems = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const { invoiceId } = req.params;

  const query = { status: true };

  const [invoiceDetails, total] = await Promise.all([
    InvoiceDetails.find(query)
      .where({ invoice: invoiceId })
      .populate("product")
      .populate("subtotal")
      .skip(from)
      .limit(limit),
    InvoiceDetails.countDocuments(query).where({ invoice: invoiceId }),
  ]);

  res.status(200).json({
    total,
    invoiceDetails,
  });
};

const updateItem = async (req, res = response) => {
  const { invoiceId, itemId } = req.params;
  const { quantity } = req.body;

  const item = await InvoiceDetails.findById(itemId);
  const product = await Product.findById(item.product);

  const data = { quantity: quantity, subtotal: product.price * quantity };
  const itemResult = await InvoiceDetails.findByIdAndUpdate(itemId, data, {
    new: true,
  });

  const items = await InvoiceDetails.find().where({ invoice: invoiceId });

  const newTotal = items.reduce(
    (acumulattor, current) => acumulattor + current.subtotal,
    0
  );
  
  console.log(newTotal);
  await Invoice.findByIdAndUpdate(
    invoiceId,
    { total: newTotal },
    { new: true }
  );

  res.status(201).json(itemResult);
};

module.exports = {
  getItems,
  updateItem,
};
