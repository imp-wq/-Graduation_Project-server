const axios = require('axios')

const emitMessage = ({ messages, io, unread }, sendMessage) => {
    unread[unread.length - 1].PYmessage = sendMessage
    messages[messages.length - 1].PYmessage = sendMessage
    io.emit('unread-server', unread)
    io.emit('message-server', messages)
}

const action = ({ message, messages, io, unread }) => {
    let isMatch = true
    switch (message) {
        case '物流':
            {
                emitMessage({ messages, io, unread }, 'deliveryInfo')
                break
            }
        case '订单':
            {
                emitMessage({ messages, io, unread }, 'Orders')
                break
            }
        case '会员':
            {
                emitMessage({ messages, io, unread }, 'Member')
                break
            }
        case '优惠':
            {
                emitMessage({ messages, io, unread }, 'Discount')
                break
            }
            // case '退货':
            //     {
            //         emitMessage({ messages, io, unread }, 'Cancel')
            //         break
            //     }
        default:
            isMatch = false
    }
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
            emitMessage({ messages, io, unread }, 'Unmatched')
        }
    })
}

module.exports = main