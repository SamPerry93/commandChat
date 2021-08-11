const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app = express();
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('./utils/messages')
//set static files
app.use(express.static(path.join(__dirname, 'public')))

const ultimateUser = 'ultimate_usr'

//run when client connects
io.on('connection', socket => {
    console.log('new websocket connection')

    //to just the individual
    socket.emit('message', formatMessage(ultimateUser,'Welcome to HackChat'));

        //to everyone other than the individual 
    //broadcast when user connects
    socket.broadcast.emit('message', formatMessage(ultimateUser,'a user has joined chat'))

        //to everybody////////
    // io.emit()
        /////////////////////

    //runs on disconnect
    socket.on('disconnect', ()=>{
        io.emit('message', formatMessage(ultimateUser,'A user has left the chat'));
    })

    //listen for messages
    socket.on('chatMessage', (msg) => {
        io.emit('message',formatMessage('anon', msg))
    })
})  

const PORT = 3000 || process.env.PORT

server.listen(PORT, ()=> console.log("server running", PORT))