const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
    dimensions: {
        width: Number,
        height: Number,
    },
    quantity: {
        type: Number,
        required: [true, 'How much do you want us to make']
    },
    status: {
        type: String,
        // enum: ['Processing...', 'Process A', 'Process B', 'Process C', 'Process D', 'Ready for collection']
        enum: ['待付款', '已付款', '生产中', '已发货', '已收货', '已退货']
    },
    surface: {
        type: String,
    },
    description: {
        type: String,
    },
    thickness: {
        type: Number,
    },
    schematics: {
        type: Array,
    },

    // 新增字段
    originalPrice: {
        type: Number,
        required: true
    },
    actualPrice: {
        type: Number,
        required: true
    },
    updatedTime: {
        type: Date
    },
    deliveryOrderID: {
        type: String,
        default: ''
    },
    deliveryCompany: {
        type: String,
        default: ''
    },
    deliveryCurrentLocation: {
        type: String,
    },
    refundReason: {
        type: String,
        default: ''
    }
});

const Order = mongoose.model('Order', OrderSchema, 'Order');

module.exports = Order