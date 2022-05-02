const axios = require('axios');

exports.Bot = async (message, senderEmail ) => {
    const {NlpManager, Language } = require('node-nlp');

    const manager = new NlpManager ({ languages: 'zh', forceNER: true, nlu: { useNoneFeature: false }});

    //bye
    manager.addDocument('zh', '再见', 'greetings.bye');

    //greetings 
    manager.addDocument('zh', '你好', 'greetings.hello');

    //date
    manager.addDocument('zh', '今天几号？', 'fetchDate');

    //Inquire Pending Orders
    manager.addDocument('zh', '待处理订单', 'getPendingOrders');

    //Inquire Completed orders
    manager.addDocument('zh', '完成的订单','fetchCompletedOrders');

    //Add a schematic
    manager.addDocument('zh', '加图片', 'addSchematic');

    //create an order
    manager.addDocument('zh', '新订单', 'createOrder');
    
    //cancel an order
    manager.addDocument('zh', '删除订单', 'deleteOrder');

    //how many orders do I have
    manager.addDocument('zh', '多少订单', 'orderNumber');

    //View an order
    manager.addDocument('zh', '看订单', 'viewOrder');
    manager.addDocument('zh', '开订单', 'viewOrder');

   

    //response for added item
    manager.addDocument('zh', '好吧', 'addResponse');
    manager.addDocument('zh', '好的', 'addResponse');
    manager.addDocument('zh', '行', 'addResponse');

    //need help
    manager.addDocument('zh', '帮助', 'Help')

    //-------------Answers------------------//

    manager.addAnswer('en', 'EmptyInquiry', '我该如何帮忙?');

    manager.addAnswer('zh', 'addResponse', manager.getActions('addResponseAction'));
    manager.addAction('addResponse', 'addResponseAction', '', () => {
        return '好的， 成功了'
    })

    manager.addAnswer('zh', 'addResponse', '👌')

    manager.addAnswer('zh', 'addSchematic', manager.getActions('addSchematicAction'));
    manager.addAction('addSchematic', 'addSchematicAction', '', async () => {
        let Orders = {
            type: 'list',
            list: [],
        };

        await axios.get('http://localhost:5000/order', {
            params: {
                email: senderEmail,
            }
        })
        .then (result => {
            let myOrders = result.data.Orders.map( i => {
                let listObject = {
                    id: i._id,
                    quantity: i.quantity,
                    schematics: i.schematics,
                    eta: i.estimatedTime,
                    description: i.description,
                    dimensions: i.dimensions,
                    currentProcess: i.currentProcess,
                    surface: i.surface,
                    thickness:i.thickness,
                    action: 'ADD_SCHEMATIC'
                }
                return listObject;
            })
            Orders.list = myOrders;
        })
        .catch(err => {
            console.log(err);
        })

        Orders.length = Orders.list.length;
        // if ( Orders.length > 1) {
        //     Orders.text = `您有 ${Orders.length} 个订单: 您想删除哪一个`;
        // } else if (Orders.length === 1 ) {
        //     Orders.text = `您只有一个订单`;
        // } else {
        //     Orders.text = `您没有订单`;
        // }

        Orders.text = "您要将原理图添加到哪个项目:"
        return JSON.stringify(Orders);
    })
    //bye
    manager.addAnswer('zh', 'greetings.bye', '再见！');

    //greetings
    manager.addAnswer('zh', 'greetings.hello', '您好，我该如何服务?');

    //create an order
    manager.addAnswer('zh', 'createOrder', 'bot-create-order');

    //cancel an order
    manager.addAnswer('zh', 'deleteOrder', manager.getActions('deleteOrderAction'));
    manager.addAction('deleteOrder', 'deleteOrderAction', '', async () => {
        let Orders = {
            type: 'list',
            list: [],
        };

        await axios.get('http://localhost:5000/order', {
             params: {
                 email: senderEmail
             }
         })
         .then (result => {
             let myOrders = result.data.Orders.map( i => {
 
                 let listObject = {
                     id: i._id,
                     quantity: i.quantity,
                     schematics: i.schematics,
                     eta: i.estimatedTime,
                     description: i.description,
                     dimensions: i.dimensions,
                     currentProcess: i.currentProcess,
                     action: 'Delete'
                 }
                 return listObject;
             })
             Orders.list = myOrders;
         })
         .catch( err => {
             console.log(err);
         })
 
         Orders.length = Orders.list.length;
         if ( Orders.length > 1) {
             Orders.text = `您有 ${Orders.length} 个订单`;
         } else if (Orders.length === 1 ) {
             Orders.text = `您只有一个订单`;
         } else {
             Orders.text = `您没有订单`;
         }
 
         return JSON.stringify(Orders);
    })


    //how many orders
    manager.addAnswer('en', 'orderNumber', manager.getActions('getOrderNumberAction'));
    manager.addAction('orderNumber', 'getOrderNumberAction', '', async () => {
         let numberOfOrders;
 
         await axios.get('http://localhost:5000/getOrderNumber', {
             params: {
                 email: senderEmail
             }
         }).then(result => {
             console.log('tj debugging', result.data);
             numberOfOrders = result.data.OrderNumber
         })
         .catch(err => {
             console.log(err);
         })
         return `您一共有 ${numberOfOrders} 个订单。`;
     })

    //date
    manager.addAnswer('zh', 'fetchDate', manager.getActions());
    manager.addAction('fetchDate', 'fetchDate', '', async () => {
        const date1 = new Date();
        return manager.addAnswer('zh', 'fetchDate', `今天是 ${date1.getMonth()} 月 ${date1.getDay()} 号` );
    })

    //view orders
    manager.addAnswer('zh', 'viewOrder', manager.getActions('viewOrderAction'));
    manager.addAction('viewOrder', 'viewOrderAction', '', async () => {
        let Orders = {
            type: 'list',
            list: [],
        };

        await axios.get('http://localhost:5000/order', {
            params: {
                email: senderEmail
            }
        })
        .then (result => {
            let myOrders = result.data.Orders.map( i => {
                let listObject = {
                    id: i._id,
                    quantity: i.quantity,
                    schematics: i.schematics,
                    eta: i.estimatedTime,
                    description: i.description,
                    dimensions: i.dimensions,
                    currentProcess: i.currentProcess,
                    surface: i.surface,
                    thickness: i.thickness,
                    action: 'View'
                }
                return listObject;
            })
            Orders.list = myOrders;
        })
        .catch(err => {
            console.log(err);
        })

        Orders.length = Orders.list.length;
        if ( Orders.length > 1) {
            Orders.text = `您有 ${Orders.length} 个订单，想看哪一个？`;
        } else if (Orders.length === 1 ) {
            Orders.text = `您只有一个订单`;
        } else {
            Orders.text = `您没有订单`;
        }

        return JSON.stringify(Orders);

    })
    

    //change order attempt
    manager.addAnswer('zh', 'changeOrderAttempt', manager.getActions('changeOrderAttemptAction'));
    manager.addAction('changeOrderAttempt', 'changeOrderAttemptAction', '', async () => {
        let Response = {
            type: 'list', 
            list: [
                    {
                        text:'创建一个新订单',
                        action: 'Suggest'
                    }, 
                    {
                        text: '查看所有订单',
                        action: 'Suggest',
                    },
                    {
                        text: '删除订单',
                        action: 'Suggest'
                    }
                ],
            text: "不幸的是，一旦订单被处理，您将无法编辑。但是，您可以执行以下任一操作： "
        }

        return JSON.stringify(Response);
    })

    //Pending Orders
    manager.addAnswer('zh', 'getPendingOrders', manager.getActions('getPendingOrdersAction'));
    manager.addAction('getPendingOrders', 'getPendingOrdersAction', '', async () => {
        let PendingOrders = {
            type: 'list',
            list: [],
            text: "这些是您的待处理订单"
        }
        await axios.get('http://localhost:5000/order', {
            params: {
                email: senderEmail
            }
        }).then(result => {
            const { data: {Orders} } = result;

            Orders.forEach(i => {
                i.action = "View";
                i.currentProcess !== "Ready for collection" ? PendingOrders.list.push(i) : null;
            });

        }).catch(err => {
            console.log(err);
        })
        
        return PendingOrders.list.length === 0 ? "您没有待处理的订单": JSON.stringify(PendingOrders);
    });

    //completed Orders
    manager.addAnswer('zh', 'fetchCompletedOrders', manager.getActions('fetchCompletedOrdersAction'));
    manager.addAction('fetchCompletedOrders', 'fetchCompletedOrders', '', async () => {
        let CompletedOrders = {
            type: 'list',
            list: [],
            text: "这些是您完成的订单"
        }
        await axios.get('http://localhost:5000/order', {
            params: {
                email: senderEmail
            }
        }).then(result => {
            const { data: {Orders} } = result;

            Orders.forEach(i => {
                i.action = "View";
                i.currentProcess === "Ready for collection" ? CompletedOrders.list.push(i) : null;
            });
        }).catch(err => {
            console.log(err);
        })
        
        return CompletedOrders.list.length === 0 ? "您没有完成的订单" : JSON.stringify(CompletedOrders);
    })


    await manager.train();
    manager.save();
    const response = await manager.process(`zh`, message);
    // console.log(response);
    return response.answer;

}