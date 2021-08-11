const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector('.chat-messages')
const socket = io();

socket.on('message', message=>{
    console.log(message)
    outputMessage(message)
    //scroll down to new message
    chatMessages.scrollTop = chatMessages.scrollHeight
})

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