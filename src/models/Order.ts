import mongoose, { Document, Schema } from "mongoose";

export interface OrderDoc extends Document {
    orderID: string,
    vendorId: string,
    items: [any],
    totalAmount: number,
    orderDate: Date,
    paidThrough: string,
    paymentResponse: number,
    orderStatus: string,
    remarks: string,
    deliveryId: string,
    appliedOffers: boolean,
    offerId: string,
    readyTime: number
}

const orderSchema = new Schema({
    orderID: {type: String, required: true},
    vendorId: {type: String, require: true},
    items: [
        {
            food: {type: Schema.Types.ObjectId, ref: 'food', required: true}, 
            unit: {type: Number, required: true}
        }
    ],
    totalAmount: {type: Number, required: true},
    orderDate: {type: Date},
    paidThrough: {type: String, required: true},
    paymentResponse: {type: Number},
    orderStatus: {type: String},
    remarks: {type: String},
    deliveryId: {type: String},
    appliedOffers: {type: Boolean},
    offerId: {type: String},
    readyTime: {type: Number}
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
        }
    },
    timestamps: true
})

const Order = mongoose.model<OrderDoc>('order', orderSchema);

export {Order}