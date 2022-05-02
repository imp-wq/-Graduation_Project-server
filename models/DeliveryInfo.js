// 物流信息的Schema和Model

const mongoose = require('mongoose')
const DeliveryInfoSchema = mongoose.Schema({
    userID: mongoose.Schema.Types.ObjectId,
    orderID: mongoose.Schema.Types.ObjectId,
    position: String
})

const DeliveryInfo = mongoose.model('DeliveryInfo', DeliveryInfoSchema, 'DeliveryInfo')
module.exports = DeliveryInfo