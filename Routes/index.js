const express = require('express');
const router = express.Router();
const UserController = require('../Controller');
const Order = require('../CustomerService/BotAction');
const { deliveryInfo, member, updateOrderStatus, getDiscount } = require('../CleverService/MoreAction')

// 更多的路由信息
router.route('/deliveryInfo').get(deliveryInfo)
router.route('/member').get(member)
router.route('/updateorderstatus').post(updateOrderStatus)
router.route('/discount').get(getDiscount)
    /***************************************************************************************************/

//Verify User
router
    .route('/Verify')
    .get(UserController.verifyToken);

// Sign Up
router
    .route('/new-user')
    .post(UserController.postUser);

//Login
router
    .route('/login')
    .post(UserController.getUser)

//submit form
router
    .route('/order')
    .get(Order.fetchOrders)
    .post(Order.postOrder)

//upload image
router
    .route('/upload/:email')
    .post(Order.uploadImage);

router
    .route('/addSchematic')
    .put(Order.AddSchematics)

// fetch order
router
    .route('/getOrder')
    .get(Order.fetchOneOrder)
    // .delete(Order.deleteOrder)
    // .put(Order.updateOrder)

router
    .route('/getOrderNumber')
    .get(Order.getOrderNumber)





module.exports = router;