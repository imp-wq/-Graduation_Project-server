const User = require('../models/User')
const DeliveryInfo = require('../models/DeliveryInfo')
const FinishedOrders = require('../models/FinishedOrders')
const Orders = require('../models/Order')

exports.deliveryInfo = async(req, res) => {
    // const user = await User.findOne({ email: req.query.email })
    // console.log(user._id)
    // if (!user.id) throw "查找用户失败！"
    //     // const orders = await DeliveryInfo.find()
    // const orders = await DeliveryInfo.find({ userID: user._id })
    // console.log(orders)

    const email = req.query.email
    const user = await User.findOne({ email })
    const orders = []
    for (const item of user.orderIds) {
        const getOneOrder = await Orders.findOne({ _id: item })
        if (getOneOrder.status === '已发货') orders.push(getOneOrder)
    }

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


exports.updateOrderStatus = async(req, res) => {
    console.log('updateOrderStatus', req.body)
    const order = await Orders.findOneAndUpdate({ _id: req.body._id }, {...req.body.update })
        // console.log(order)
    res.json({ message: 'updateOrderStatus' })
}

exports.getDiscount = async(req, res) => {
    // console.log('getDiscount', req.query)
    const email = req.query.id
    const user = await User.findOne({ email })
    let totalNum = 0
    for (const item of user.orderIds) {
        const getOneOrder = await Orders.findOne({ _id: item })
        if (getOneOrder.status === '已完成') totalNum += getOneOrder.actualPrice
    }

    let discount
    if (totalNum < 10000) discount = 1
    else if (totalNum >= 10000 && totalNum <= 20000) discount = 0.9
    else if (totalNum > 20000 && totalNum <= 30000) discount = 0.85
    else if (totalNum > 30000) discount = 7
    else {
        console.log('discount计算出错')
        discount = 1
    }
    res.json({ discount, totalNum })
}