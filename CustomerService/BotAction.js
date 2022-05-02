const User = require('../models/User');
const fs = require('fs');
const { Helper } = require('dxf');
const { join } = require('path');
const multer = require('multer');
const Order = require('../models/Order.js');


const checkType = (file) => {
    let type = [];
    if (file.length !== 0) {
        for (let i = 0; i < file.length; i++) {
            if (file[i] === '.') {
                for (let j = i + 1; j < file.length; j++) {
                    type.push(file[j]);
                }
            }
        }
    }
    return type.join('');
}

exports.getOrderNumber = async(req, res) => {
    try {
        const { email } = req.query;

        const user = await User.findOne({ email });

        res.status(200).json({
            OrderNumber: user.orders.length
        })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}
exports.fetchOrders = async(req, res) => {
    const { email } = req.query;

    try {
        //get user
        const user = await User.findOne({ email });

        let ordersList = null;

        if (user) ordersList = user.orders;

        for (let i = 0; i < ordersList.length; i++) {

            const { schematics } = ordersList[i];

            const schematicsArray = schematics.map(i => {
                let type = checkType(i);

                if (type === 'dxf') {
                    const helper = new Helper(fs.readFileSync(
                        `./public/uploads/${email}/${i}`, 'utf-8'));

                    const { blocks, entities } = helper.parsed

                    // Denormalised blocks inserted with transforms applied

                    // Group entities by layer. Returns an object with layer names as
                    // keys to arrays of entities.
                    const groups = helper.groups

                    Object.keys(groups).forEach(layer => {})

                    const svg = helper.toSVG();
                    fs.writeFileSync(join(__dirname, `../public/uploads/${email}/${i.replace('.dxf', '')}.svg`), svg, 'utf-8');

                    return i.replace('dxf', 'svg');
                } else {
                    return i;
                }
            });

            ordersList[i].schematics = schematicsArray;

        }

        res.status(200).json({
            Orders: ordersList,
        })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}


exports.fetchOneOrder = async(req, res) => {
    const { name, id } = req.query;

    try {
        const user = await User.findOne({ email: name });

        let order = null;

        user.orders.map(i => {
            if (i._id == id) {
                order = i;
            }
        })

        // if(user) ordersList = user.orders;

        res.status(200).json({
            Orders: order
        })
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}



exports.deleteOrder = async(req, res) => {
    const { value, user } = req.body

    try {
        const order = await User.findOneAndUpdate({ email: user });
        await order.orders.pull(value);

        order.save();

        res.status(200).send()
    } catch (err) {
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.postOrder = async(req, res) => {
    const { form, userEmail } = req.body

    try {
        let targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 14);

        let dd = targetDate.getDate();
        let mm = targetDate.getMonth() + 1; // 0 is January, so we must add 1
        let yyyy = targetDate.getFullYear();

        let dateString = dd + "/" + mm + "/" + yyyy;

        const newOrder = await Order({...form, currentProcess: '待处理', estimatedTime: dateString });
        let activeUser = await User.findOneAndUpdate({ email: userEmail }, {
            $push: {
                orders: newOrder
            }
        });

        res.status(200).json({
            status: 'success',
            order: newOrder
        })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

exports.uploadImage = async(req, res) => {
    const { email } = req.params;

    try {
        console.log('here');
        const storage = multer.diskStorage({
            destination: `./public/uploads/${email}/`,
            filename: function(req, file, cb) {
                cb(
                    null,
                    file.originalname
                );
            },
        });

        const upload = multer({
            storage,
            limits: { fileSize: 10000000000 },
        }).array("file");

        upload(req, res, function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }

            return res.status(200).send(req.file);
        })

    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            status: "sorry something went wrong",
            message: err.message
        })
    }
}


exports.updateOrder = async(req, res) => {
    const { user, orderId, Process, language } = req.body.params;

    try {
        let onlineUser;
        onlineUser = await User.findOneAndUpdate({ email: user, 'orders._id': orderId }, {
            '$set': {
                'orders.$.currentProcess': Process
            }
        });

        onlineUser.save();

        res.status(200).send({
            status: 'success',
            message: language === "English" ? `Status Update: your order(${orderId}) is now in ${Process}` : `状态更新：您的订单${orderID}正在${Process}中`,
            orderId,
            Process
        });

    } catch (err) {
        console.log(err.message);
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

exports.AddSchematics = async(req, res) => {
    const { email, projectId, schematics } = req.body.params;

    try {

        let onlineUser = await User.findOneAndUpdate({
            email,
            'orders._id': projectId
        }, {
            '$push': {
                'orders.$.schematics': {
                    '$each': schematics,
                    '$position': 0
                }
            }
        });

        onlineUser.save();

        res.status(200).send();

    } catch (err) {
        console.log(err.message);
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}