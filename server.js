const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const app = express();
const server = http.createServer(app)
const io = socketio(server)
//set static files
app.use(express.static(path.join(__dirname, 'public')))

//run when client connects
io.on('connection', socket => {
    console.log('new websocket connection')

    //to just the individual
    socket.emit('message', 'Welcome to HackChat');

        //to everyone other than the individual 
    //broadcast when user connects
    socket.broadcast.emit('message', 'a user has joined chat')

        //to everybody////////
    // io.emit()
        /////////////////////

    //runs on disconnect
    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat');
    })
})  

const PORT = 3000 || process.env.PORT

server.listen(PORT, ()=> console.log("server running", PORT))