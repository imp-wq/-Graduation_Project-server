// 已完成订单的Schema和Model

const mongoose = require('mongoose')
const FinishedOrdersSchema = mongoose.Schema({
    orderID: mongoose.Schema.Types.ObjectId,
    userID: mongoose.Schema.Types.ObjectId,
})

const FinishedOrders = mongoose.model('FinishedOrders', FinishedOrdersSchema, 'FinishedOrders')
module.exports = FinishedOrders