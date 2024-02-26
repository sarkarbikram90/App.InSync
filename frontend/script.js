// Get references to DOM elements
const messageInput = document.getElementById('messageInput');
const messageButton = document.querySelector('#messageBox button');
const callButton = document.querySelector('#Call button');

// Function to handle sending a message
function sendMessage() {
    const message = messageInput.value.trim(); // Get the message from the input field

    if (message !== '') {
        // Append the message to the main chat area
        const mainChat = document.getElementById('main');
        mainChat.innerHTML += `<div>${message}</div>`;

        // Clear the input field
        messageInput.value = '';
    }
}

// Function to handle making a call
function makeCall() {
    // Your call logic goes here
    console.log('Making a call...');
}

// Event listeners
messageButton.addEventListener('click', sendMessage);
callButton.addEventListener('click', makeCall);

// Function to toggle the display of call options dropdown
function toggleCallOptions() {
    const callButton = document.getElementById('CallButton');
    callButton.style.display = callButton.style.display === 'none' ? 'inline-block' : 'none';
}

// Function to handle making a call
function makeCall() {
    const callOption = document.getElementById('CallButton').value;
    if (callOption === 'audio') {
        // Handle audio call logic
        console.log('Making an audio call...');
    } else if (callOption === 'video') {
        // Handle video call logic
        console.log('Making a video call...');
    }
}

// Event listener for the call button
callButton.addEventListener('click', makeCall);
