document.addEventListener('DOMContentLoaded', () => {
    const dynamicText = document.getElementById('dynamic-text');
    const submitButton = document.getElementById('submit');

    const messages = [
        "Welcome to the Ultimate Number Guessing Game!",
        "Are you ready to test your luck?",
        "Can you guess the right numbers?",
        "Let's see how many attempts you need!"
    ];
    
    let messageIndex = 0;

    function updateDynamicText() {
        dynamicText.textContent = messages[messageIndex];
        messageIndex = (messageIndex + 1) % messages.length;
    }

    // Update the dynamic text every 3 seconds
    setInterval(updateDynamicText, 3000);

    submitButton.addEventListener('click', () => {
        // Navigate to the game page
        window.location.href = 'home.html'; // Make sure you have a game.html file in the same directory
    });

    // Initialize with the first message
    updateDynamicText();
});
