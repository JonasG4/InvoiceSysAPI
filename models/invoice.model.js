const { Schema, model } = require("mongoose");

const InvoiceSchema = Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  total: {
    type: Schema.Types.Decimal128,
    default: 0.0,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

InvoiceSchema.methods.toJson = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("Invoice", InvoiceSchema);
