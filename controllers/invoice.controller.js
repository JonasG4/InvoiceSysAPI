const { response, request } = require("express");
const { Invoice, InvoiceDetails, Product } = require("../models");
const { ObjectId } = require("mongoose").Types;

const getInvoices = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .populate("created_at")
      .populate("user", "name")
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
    .populate("user", "name");

  res.status(200).json(invoice);
};

const createInvoice = async (req, res = response) => {
  const { status, user, ...body } = req.body;
  const invoiceId = ObjectId();

  const car = await Promise.all(
    body.car.map(async (item) => {
      const result = await Product.findById(item.product);
      const subtotal = result.price * item.quantity;
      return { ...item, subtotal: subtotal, invoice: invoiceId };
    })
  );

  const total = car.reduce(
    (accumulator, current) => accumulator + current.subtotal,
    0
  );

  const invoiceData = {
    _id: invoiceId,
    user: req.user._id,
    total: total,
  };

  const invoice = new Invoice(invoiceData);
  const [invoiceResult, detailsResult] = await Promise.all([
    invoice.save(),
    Promise.all(
      car.map((item) => {
        const invoice_details = new InvoiceDetails(item);
        return invoice_details.save();
      })
    ),
  ]);

  res.status(200).json({ ...invoiceResult._doc, items: detailsResult });
};

const updateInvoice = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
 
  const data = { status: status, updated_at: Date.now() };

  const invoice = await Invoice.findByIdAndUpdate(id, data, { new: true });

  res.status(201).json(invoice);
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
};
