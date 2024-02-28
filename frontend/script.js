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
    // Display a message indicating the call is being made
    console.log('Making a call...');

    // Your call logic goes here
}

// Event listeners
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

messageButton.addEventListener('click', sendMessage);

// Event listener for the call button
callButton.addEventListener('click', makeCall);
