const axios = require('axios')

const action = ({ message, messages, io, unread }) => {
    let isMatch = true
    if (message === '物流') {
        unread[unread.length - 1].PYmessage = 'deliveryInfo'
        messages[messages.length - 1].PYmessage = 'deliveryInfo'
        io.emit('unread-server', unread)
        io.emit('message-server', messages)
    } else if (message === '订单') {
        unread[unread.length - 1].PYmessage = 'Orders'
        messages[messages.length - 1].PYmessage = 'Orders'
        io.emit('unread-server', unread)
        io.emit('message-server', messages)
    } else if (message === '会员') {
        unread[unread.length - 1].PYmessage = 'Member'
        messages[messages.length - 1].PYmessage = 'Member'
        io.emit('unread-server', unread)
        io.emit('message-server', messages)
    } else if (message === '优惠') {
        unread[unread.length - 1].PYmessage = 'Discount'
        messages[messages.length - 1].PYmessage = 'Discount'
        io.emit('unread-server', unread)
        io.emit('message-server', messages)
    } else if (message === '退货') {
        unread[unread.length - 1].PYmessage = 'Cancel'
        messages[messages.length - 1].PYmessage = 'Cancel'
        io.emit('unread-server', unread)
        io.emit('message-server', messages)
    } else isMatch = false // 如果没匹配到，返回false
    return isMatch
}

const main = ({ message, messages, io, unread }) => {
    console.log(message)

    // 对于关键词进行精准匹配
    if (action({ message, messages, io, unread })) return

    // 向python发送请求
    axios.get('http://localhost:5001/', { params: { message } }).then(res => {
        // res为请求到的数据
        console.log('python:', res)
        if (action({ message: res.data, messages, io, unread })) return
        else {
            unread[unread.length - 1].PYmessage = 'Unmatched'
            messages[messages.length - 1].PYmessage = 'Unmatched'
            io.emit('unread-server', unread)
            io.emit('message-server', messages)
        }

        // unread[unread.length - 1].PYmessage = res.data
        // messages[messages.length - 1].PYmessage = res.data
        // io.emit('unread-server', unread)
        // io.emit('message-server', messages)
    })
}

module.exports = main