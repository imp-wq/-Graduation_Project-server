const User = require('../models/User')
const DeliveryInfo = require('../models/DeliveryInfo')
const FinishedOrders = require('../models/FinishedOrders')

exports.deliveryInfo = async(req, res) => {
    const user = await User.findOne({ email: req.query.email })
    console.log(user._id)
    if (!user.id) throw "查找用户失败！"
        // const orders = await DeliveryInfo.find()
    const orders = await DeliveryInfo.find({ userID: user._id })
    console.log(orders)

    const sendStr = JSON.stringify(orders)
    res.status(200).json(sendStr)
}

exports.member = async(req, res) => {
    const user = await User.findOne({ email: req.query.email })
    console.log(user._id)
    if (!user.id) throw "查找用户失败！"
    const ordersNum = await FinishedOrders.find({ userID: user._id }).countDocuments()
    console.log(ordersNum)

    const sendStr = JSON.stringify({
        message: ordersNum
    })
    res.status(200).json(sendStr)
}