const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const server = app.listen(port, () => console.log(`Server running on port ${port}`))
const io = require('socket.io')(server)
    // Line on top is the same as the two lines below
    // const Socket = require('socket.io')
    // const io = Socket(server)
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const Routes = require('./Routes');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

const CleverServie = require('./CleverService/index.js')

app.use(helmet());
app.use(cors());

dotenv.config();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));


const { addUser, getUser, getAllUsers } = require('./socketUsers.js')
let messages = [],
    online = [],
    unread = []

mongoose.connect('mongodb://localhost:27017/fiberboard', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }, //connect DB

        io.on('connection', socket => {
            // socket.on('join', session => {
            //     if(session.isUserOnline){
            //         socket.join()
            //     }
            // })

            // console.log(socket)

            //When user joins the connection
            socket.on('join', ({ id, username }) => {
                let userId;
                if (id !== '' && username !== '') {
                    userId = addUser(id, username)
                }
                if (userId !== undefined) {
                    socket.join(userId)
                    const getData = getUser(userId)[0]
                    io.to(userId).emit('joined', getData)
                }
            })

            //Gets a list of everyone that's online
            socket.on('online', id => {
                let check = online.filter(o => o.id === id)
                if (!check.length > 0)
                    online.push({ id, date: new Date, status: true })
                else {
                    check = online.filter(o => {
                        if (o.id === id) {
                            o.date = new Date
                            o.status = true
                            return o
                        } else return o
                    })
                    online = check
                }
                io.emit('serverOnline', online)
            })


            // socket.on('getOnline', (id) => {
            //     io.to(id).emit('serverOnline', online)
            // })

            //make user offline before CHAT component is unmounted
            socket.on('rmonline', id => {
                const check = online.filter(o => {
                    if (o.id === id) {
                        o.status = false
                        return o
                    } else return o
                })

                online = check

                io.emit('serverOnline', online)
            })

            // send recepient data
            socket.on('userdata', ({ id, userId }) => {
                let data = getUser(id)[0]
                io.to(userId).emit('receivedData', data)
            })

            // returns all the users
            socket.on('allusers', () => {
                let users = getAllUsers();
                io.emit('serverallusers', users)
            })

            //gets all the messages
            socket.on('getmessages', id => {
                io.to(id).emit('message-server', messages)
            })

            // return unread messages
            socket.on('unread', id => {
                io.to(id).emit('unread-server', unread)
            })

            //remove unread
            socket.on('rmunread', ({ userId, to }) => {
                const rm = unread.filter(r => !((r.to === userId) && (r.senderId === to)))
                unread = rm
                io.to(userId).emit('unread-server', unread)
            })

            socket.on('message-client', ({ senderId, username, to, message, date, language }) => {

                // console.log({ senderId, username, to, message, date, language })

                unread.push({ senderId, to, username, message, date, system: false })
                messages.push({ senderId, to, username, message, date, system: false })
                io.emit('unread-server', unread)
                io.emit('message-server', messages)

                if (senderId === "Customer-Service-auto") {
                    unread.push({ senderId: 'Customer Service', to, username: 'Customer Service', message, date, system: true })
                    messages.push({ senderId: 'Customer Service', to, username: 'Customer Service', message, date, system: true })

                    io.emit('unread-server', unread)
                    io.emit('message-server', messages)
                }

                // bot response
                if (to === 'Customer Service') {
                    if (language === 'English') ProcessBot = require('./CustomerService/bot-english');
                    if (language === 'Chinese') ProcessBot = require('./CustomerService/bot-chinese');
                    ProcessBot.Bot(message, senderId)
                        .then(result => {
                            if (result == 'bot-create-order') {
                                return socket.emit('NewOrderModal', 'bot-create-order');
                            }
                            if (result == 'bot-delete-order') {
                                return socket.emit('DeleteOrder', 'bot-delete-order');
                            }
                            if (!result) {
                                // unread.push({ senderId: to, to: senderId, username: 'Customer Service', message: language === "Chinese" ? "不好意思， 我不明白" : "I'm sorry I don't quite understand. How may I help you?", date, system: false })
                                // messages.push({ senderId: to, to: senderId, username: 'Customer Service', message: language === "Chinese" ? "不好意思， 我不明白" : "I'm sorry I don't quite understand. How may I help you?", date, system: false })

                                unread.push({ senderId: to, to: senderId, username: 'Customer Service', message: {}, date, system: false })
                                messages.push({ senderId: to, to: senderId, username: 'Customer Service', message: {}, date, system: false })
                            } else {
                                unread.push({ senderId: to, to: senderId, username: 'Customer Service', message: result, date, system: false })
                                messages.push({ senderId: to, to: senderId, username: 'Customer Service', message: result, date, system: false })
                            }

                            // 智能客服模块
                            CleverServie({ message, messages, io, unread })
                        });
                };
            })
        }),
    )
    .then(() => console.log('connected to DB'))
    .catch(err => {
        alert('There was an error connecting to the server, please contact system administrator.');
        console.log(err);
    });

app.use('/', Routes)