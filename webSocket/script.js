// Get references to DOM elements
const messageInput = document.getElementById('messageInput');
const messageButton = document.querySelector('#messageBox button');
const callButton = document.querySelector('#callButton');

// WebSocket connection
const socket = new WebSocket('ws://http://127.0.0.1:5500/'); // Replace 'your-websocket-server-url' with the actual WebSocket server URL

// Function to handle sending a message over WebSocket
function sendMessage() {
    const message = messageInput.value.trim(); // Get the message from the input field

    if (message !== '') {
        // Send the message over WebSocket
        socket.send(message);

        // Clear the input field
        messageInput.value = '';
    }
}

// Event listeners
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

messageButton.addEventListener('click', sendMessage);

// Function to handle receiving a message over WebSocket
socket.addEventListener('message', function(event) {
    const receivedMessage = event.data; // Get the received message
    // Append the received message to the main chat area
    const mainChat = document.getElementById('main');
    mainChat.innerHTML += `<div>${receivedMessage}</div>`;
});

// Function to handle making a call
function makeCall() {
    // Display a message indicating the call is being made
    console.log('Making a call...');

    // Your call logic goes here
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    callButton.addEventListener('click', makeCall);
});

