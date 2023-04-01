const { response, request } = require("express");
const { Invoice, InvoiceDetails, Product } = require("../models");

const getInvoices = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .populate("created_at")
      .populate("customer", "name")
      .skip(from)
      .limit(limit),
    Invoice.countDocuments(query),
  ]);

  res.status(200).json({
    total,
    invoices,
  });
};

const getInvoiceById = async (req = request, res = response) => {
  const { id } = req.params;
  const invoice = await Invoice.findById(id)
    .populate("created_at")
    .populate("customer", "name");

  res.status(200).json(invoice);
};

const createInvoice = async (req, res = response) => {
  const { status, invoice, ...body } = req.body;

  const products = [];

  body.car.map(async (product) => {
    await Product.findById(product.product).then((err, data) => {
      if (err) throw err;
      products.push(data);
    }).catch(err => console.log(err))
  });

  res.status(200).json(products);
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
};
