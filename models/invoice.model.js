const { Schema, model } = require("mongoose");

const InvoiceSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  total: {
    type: Schema.Types.Decimal128,
    default: 0.0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

InvoiceSchema.methods.toJson = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("Invoice", InvoiceSchema);
