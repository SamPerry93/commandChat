const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
//getuser and rooom
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

const socket = io();

//join room
socket.emit('joinRoom', {username, room})

//get room and users
socket.on('roomUsers', ({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message=>{
    console.log(message)
    outputMessage(message)
    //scroll down to new message
    chatMessages.scrollTop = chatMessages.scrollHeight
})
console.log(username,room)
//message submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    //sending msg to server
    socket.emit('chatMessage',msg)
    //clr input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//send message to DOM
function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
        <p class="meta">${message.username}<span>${message.time}</span></p>
        <p class="text">${message.text}
        </p>
    `
    document.querySelector('.chat-messages').appendChild(div)
}

//add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;

}
//add users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}