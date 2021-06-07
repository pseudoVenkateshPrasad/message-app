console.log("Hello World")

const socket = io();

let outgoingName = document.getElementById("main-name-title").innerText;
let friendname = document.querySelectorAll('.name-size');
let incomingName = document.getElementById("my-name").innerText;

let today = new Date();
let time = today.getHours() + ":" + today.getMinutes();
console.log(time)


for (let i of friendname){
    i.addEventListener('click',() => {
        // console.log(i, outgoingName)
        if(i.innerText == outgoingName){
            // console.log(true)
            alert('Cannot Select Yourself');
            
        }
        // else{
        //     console.log(false)
        // }
        incomingName = i.innerText;
        console.log(incomingName)
    })
}

let textArea = document.querySelector("#text-area");
let messageArea = document.querySelector(".chatarea")


textArea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter'){
        console.log(e.target.value)
        sendMessage(e.target.value)
    }
   
})

function sendMessage(message){

    if(incomingName == ''){
        window.alert("Select a User from Friends List..")
        myScroll();
        return;
    }

    

    let msg = {
        myName: outgoingName.trim(),
        friendName: incomingName.trim(),
        message: message.trim(),
        time : time
    }

    // Appending Message
    appendMessage(msg, 'outgoing');
    textArea.value = '';
    myScroll();
    

    // Sending to server
    socket.emit('message', msg)
}


function appendMessage(msg, type){
    let mainDiv = document.createElement('div');
    let className = type
    mainDiv.classList.add(className, 'message');

    let markup = ` ${msg.message}
                    `

    mainDiv.innerText = markup;
    messageArea.appendChild(mainDiv)
    

}


// Recieved Message

socket.on('message', (msg) => {
    console.log(msg)
    appendMessage(msg, 'incoming')
    myScroll();
})



// Scroll to bottom

function myScroll(){
    messageArea.scrollTop = messageArea.scrollHeight;
}