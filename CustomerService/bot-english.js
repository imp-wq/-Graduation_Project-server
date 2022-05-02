const axios = require('axios');


exports.Bot = async (message, senderEmail) => {

    const { NlpManager } = require('node-nlp');

    const manager = new NlpManager({ languages: ['en', 'zh'], forceNER: true,  nlu: { useNoneFeature: false }});
    // Adds the utterances and intents for the NLP

     //Bye
     manager.addDocument('en', 'goodbye for now', 'greetings.bye');
     manager.addDocument('en', 'bye bye take care', 'greetings.bye');
     manager.addDocument('en', 'okay see you later', 'greetings.bye');
     manager.addDocument('en', 'bye for now', 'greetings.bye');
     manager.addDocument('en', 'i must go', 'greetings.bye');
     manager.addDocument('en', 'peace', 'greetings.bye');
 
 
     //Hello
     manager.addDocument('en', 'hello', 'greetings.hello');
     manager.addDocument('en', 'hi', 'greetings.hello');
     manager.addDocument('en', 'hey', 'greetings.hello');
     manager.addDocument('en', 'Greetings', 'greetings.hello');
     manager.addDocument('en', 'howdy', 'greetings.hello');
     manager.addDocument('en', 'Jarvis', 'greetings.hello');
     manager.addDocument('en', 'yo', 'greetings.hello');
 
 
     //What's up?
     manager.addDocument('en', 'how are you', 'greetings.howAreYou');
     manager.addDocument('en', "what's up", 'greetings.howAreYou');
     manager.addDocument('en', "what's good", 'greetings.howAreYou');
     manager.addDocument('en', 'you good', 'greetings.howAreYou');
 
     //Need help/ Have a question
     manager.addDocument('en', 'need help', 'EmptyInquiry');
     manager.addDocument('en', 'question', 'EmptyInquiry');
     manager.addDocument('en', 'help me', 'EmptyInquiry');
 
     //What Day is it
     manager.addDocument('en', 'date today', 'fetchDate');
     manager.addDocument('en',  "what's date", 'fetchDate');
     manager.addDocument('en',  "what day is it", 'fetchDate');
 
     //Inquire Pending Orders
     manager.addDocument('en', 'Orders pending', 'getPendingOrders');
     manager.addDocument('en', 'Incomplete order', 'getPendingOrders');
 
     //Inquire Completed orders.
     manager.addDocument('en', 'status complete orders', 'fetchCompletedOrders');
     manager.addDocument('en', 'finished orders', 'fetchCompletedOrders');
     manager.addDocument('en', 'done orders', 'fetchCompletedOrders');
 
     //unknown orders 
     manager.addDocument('en', 'orders', 'orderRelated');

     //add Schematic
     manager.addDocument('en', 'add Image', 'addSchematic');
 
     //create an order
     manager.addDocument('en', 'create order', 'createOrder');
     manager.addDocument('en', 'new order', 'createOrder');
     manager.addDocument('en', 'add order', 'createOrder');
     manager.addDocument('en', 'make an order', 'createOrder');
 
     //change order
     manager.addDocument('en', 'change order', 'changeOrderAttempt');
     manager.addDocument('en', 'modify order', 'changeOrderAttempt');
     manager.addDocument('en', 'edit order', 'changeOrderAttempt');
 
 
 
     //cancel an order
     manager.addDocument('en', 'cancel order', 'deleteOrder');
     manager.addDocument('en', 'delete order', 'deleteOrder');
     manager.addDocument('en', 'remove order', 'deleteOrder');
 
 
     //inquire OrderID
     manager.addDocument('en', 'information order', 'viewOrder');
     manager.addDocument('en', 'order details', 'viewOrder');
     manager.addDocument('en', 'more about order', 'viewOrder');
     manager.addDocument('en', 'check order', 'viewOrder');
     manager.addDocument('en', 'view order', 'viewOrder');
     manager.addDocument('en', 'see order', 'viewOrder');
     manager.addDocument('en', 'open order', 'viewOrder');
 
     //how many orders do I have
     manager.addDocument('en', 'how many orders', 'orderNumber');

 
 
 
     // Train also the NLG
 
     //Answers

    
     //Hello: Answer
     manager.addAnswer('en', 'greetings.hello', 'Hey there! how may I help you today?');
     manager.addAnswer('en', 'greetings.hello', 'Greetings! how may I help you today?');
     manager.addAnswer('en', 'greetings.hello', 'Hello! how may I help you today?');
     manager.addAnswer('en', 'greetings.hello', 'Hi! how may I help you today?');
 
     //Bye: Answer
     manager.addAnswer('en', 'greetings.bye', 'Till next time');
     manager.addAnswer('en', 'greetings.bye', 'see you soon!');
     manager.addAnswer('en', 'greetings.bye', 'Have a great day!');
     manager.addAnswer('en', 'greetings.bye', 'Goodbye!');
     manager.addAnswer('en', 'greetings.bye', 'Bye bye!');
 
     //Whats up: Answer
     manager.addAnswer('en', 'greetings.howAreYou', 'Im here to help, how may I help you?');
     manager.addAnswer('en', 'greetings.howAreYou', 'How may I help you?');
     manager.addAnswer('en', 'greetings.howAreYou', 'I am meant to help, How may I help you?');
 
 
     //Need help/have a question
     manager.addAnswer('en', 'EmptyInquiry', 'How may I help?');
     manager.addAnswer('en', 'EmptyInquiry', 'What do you need?');
     manager.addAnswer('en', 'EmptyInquiry', 'What can I do for you?');
 
     //Get the date
     manager.addAnswer('en', 'fetchDate', manager.getActions())
     manager.addAction('fetchDate', 'fetchDate','', () => {
         const date1 = new Date();
          return manager.addAnswer('en', 'fetchDate', `Today is ${date1}` );
     })

     //add Schematic
     manager.addAnswer('en', 'addSchematic', manager.getActions('addSchematicAction'));
     manager.addAction('addSchematic', 'addSchematicAction', '', async () => {
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
                 console.log(i);
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
        //  if ( Orders.length > 1) {
        //      Orders.text = `You have ${Orders.length} Orders: which would you like to View?`;
        //  } else if (Orders.length === 1 ) {
        //      Orders.text = `You only have one order.`;
        //  } else {
        //      Orders.text = `You have no orders to View.`;
        //  }

         Orders.text = "Which project would you like to add the schematics to?"
 
         return JSON.stringify(Orders);
 
     })
 
     // suggestions for orders
     manager.addAnswer('en', 'orderRelated', manager.getActions('orderRelatedAction'));
     manager.addAction('orderRelated', 'orderRelatedAction', '', async () => {
         let Response = {
             type: 'list',
             list: [
             {
                 text:'Create a new order',
                 action: 'Suggest'
             }, 
             {
                 text: 'View orders',
                 action: 'Suggest',
             },
             {
                 text: 'Delete order',
                 action: 'Suggest'
             }
             ],
             text: 'Did you mean?'   
         }
 
         return JSON.stringify(Response);
     })
 
 
     //change Order attempt 
     manager.addAnswer('en', 'changeOrderAttempt', manager.getActions('changeOrderAttemptAction'));
     manager.addAction('changeOrderAttempt', 'changeOrderAttemptAction', '', async () => {
         let Response = {
             type: 'list', 
             list: [
                     {
                         text:'Create a new order',
                         action: 'Suggest'
                     }, 
                     {
                         text: 'View orders',
                         action: 'Suggest',
                     },
                     {
                         text: 'Delete order',
                         action: 'Suggest'
                     }
                 ],
             text: "Unfortunately you can't edit an order once it has been processed. However you may do one of the following options: "
         }
 
         return JSON.stringify(Response);
     })
     //Create an order
     manager.addAnswer('en', 'createOrder', 'bot-create-order');
 
     //delete order 
     manager.addAnswer('en', 'deleteOrder', manager.getActions('deleteOrderAction'));
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
             Orders.text = `You have ${Orders.length} Orders: which would you like to delete?`;
         } else if (Orders.length === 1 ) {
             Orders.text = `You only have one order.`;
         } else {
             Orders.text = `You have no orders to delete.`;
         }
 
         return JSON.stringify(Orders);
 
     });
 
     manager.addAnswer('en', 'viewOrder', manager.getActions('viewOrderAction'));
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
                 console.log(i);
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
             Orders.text = `You have ${Orders.length} Orders: which would you like to View?`;
         } else if (Orders.length === 1 ) {
             Orders.text = `You only have one order.`;
         } else {
             Orders.text = `You have no orders to View.`;
         }
 
         return JSON.stringify(Orders);
 
     })


     manager.addAnswer('en', 'getPendingOrders', manager.getActions('getPendingOrdersAction'));
     manager.addAction('getPendingOrders', 'getPendingOrdersAction', '', async () => {
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
                 console.log(i);
                 if(i.currentProcess !== "Ready for collection") {
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

                }
             })
             Orders.list = myOrders;
         })
         .catch(err => {
             console.log(err);
         })
 
         Orders.length = Orders.list.length;
         if ( Orders.length > 1) {
             Orders.text = `You have ${Orders.length} Orders Pending.`;
         } else if (Orders.length === 1 ) {
             Orders.text = `You only have one pending order.`;
         } else {
             Orders.text = `You have no pending orders.`;
         }
 
         return JSON.stringify(Orders);
 
     })

     manager.addAnswer('en', 'fetchCompletedOrders', manager.getActions('fetchCompletedOrdersAction'));
     manager.addAction('fetchCompletedOrders', 'fetchCompletedOrdersAction', '', async () => {
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
            const {data: {Orders}} = result;

            Orders.forEach(i => {
                i.action = "View";
                i.currentProcess === "Ready for collection" ? Orders.list.push(i) : null;
            });
         })
         .catch(err => {
             console.log(err);
         })
 
         Orders.length = Orders.list.length;
         if ( Orders.length > 1) {
             Orders.text = `You have ${Orders.length} completed orders.`;
         } else if (Orders.length === 1 ) {
             Orders.text = `You only have one completed order.`;
         } else {
             Orders.text = `You have no completed orders.`;
         }
 
         return JSON.stringify(Orders);
 
     })
     
 
     manager.addAnswer('en', 'orderNumber', manager.getActions('getOrderNumberAction'));
     manager.addAction('orderNumber', 'getOrderNumberAction', '', async () => {
         let numberOfOrders;
 
         await axios.get('http://localhost:5000/getOrderNumber', {
             params: {
                 email: senderEmail
             }
         }).then(result => {
             numberOfOrders = result.data.OrderNumber
         })
         .catch(err => {
             console.log(err);
         })
 
         if (numberOfOrders === 1) return `you have ${numberOfOrders} order.`
         return `You have ${numberOfOrders} orders.`;
     })
    
    await manager.train();
    manager.save();
    const response = await manager.process(`en`, message);
    return response.answer;

}
