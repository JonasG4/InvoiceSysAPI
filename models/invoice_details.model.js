const {Schema, model} = require("mongoose");


const InvoiceDetailsSchema = Schema({
    invoice: {
     type: Schema.Types.ObjectId,
     ref: "Invoice",
     required: true
    },
    product: {
     type: Schema.Types.ObjectId,
     ref: "Product",
     required: true
    },
    Quantity: {
     type: Number,
     required: true,
    },
    subtotal: {
     type: Schema.Types.Decimal128,
     required: true
    }
}) 

InvoiceDetailsSchema.methods.toJson = function (){
    const {__v, ...data} = this.toObject();

    return data;
}

module.exports = model("Invoice_Details", InvoiceDetailsSchema)