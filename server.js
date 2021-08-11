const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app = express();
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser,userLeave,getRoomUsers} = require('./utils/users')
//set static files
app.use(express.static(path.join(__dirname, 'public')))

const ultimateUser = 'ultimate_usr'

//run when client connects
io.on('connection', socket => {
    console.log('new websocket connection')
    //joine room
    socket.on('joinRoom', ({username,room})=>{
        const user = userJoin(socket.id, username,room)
        socket.join(user.room)

            //to just the individual
        socket.emit('message', formatMessage(ultimateUser,'Welcome to HackChat'));

            //to everyone other than the individual 
        //broadcast when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(ultimateUser,`${user.username} has joined room`))

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users:getRoomUsers(user.room)
        })
    })
        //to everybody////////
    // io.emit()
        /////////////////////

    //runs on disconnect
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id)

        if(user){
            io.to(user.room).emit('message', formatMessage(ultimateUser,`${user.username} has left the room`));
        }
    })

    //listen for messages
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username, msg))
    })
})  

const PORT = 3000 || process.env.PORT

server.listen(PORT, ()=> console.log("server running", PORT))