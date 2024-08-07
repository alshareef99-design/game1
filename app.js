document.addEventListener('DOMContentLoaded', () => {
    const playerInput = document.getElementById('player-numbers');
    const submitButton = document.getElementById('submit');
    const resultParagraph = document.getElementById('result');
    const attemptsParagraph = document.getElementById('attempts');
    const restartButton = document.getElementById('restart');

    let computerNumbers = [];
    let attempts = 0;

    function generateRandomNumbers() {
        computerNumbers = [];
        while (computerNumbers.length < 3) {
            const num = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
            if (!computerNumbers.includes(num)) {
                computerNumbers.push(num);
            }
        }
    }

    function handleGuess() {
        const playerNumbers = playerInput.value.split(/\s+/).map(num => parseInt(num.trim(), 10));
        
        if (playerNumbers.length !== 3 || playerNumbers.some(isNaN)) {
            resultParagraph.textContent = 'Please enter exactly 3 valid numbers separated by spaces.';
            return;
        }

        attempts++;
        
        let correctNumbers = 0;
        let feedback = '';

        playerNumbers.forEach(num => {
            if (computerNumbers.includes(num)) {
                correctNumbers++;
            }
        });

        if (correctNumbers === 3) {
            resultParagraph.textContent = `Congratulations! You guessed all 3 numbers correctly in ${attempts} attempts.`;
            submitButton.disabled = true;
            restartButton.style.display = 'inline';
        } else {
            feedback = `${correctNumbers} number${correctNumbers > 1 ? 's' : ''} correct. Try again!`;
            resultParagraph.textContent = feedback;
        }

        attemptsParagraph.textContent = `Attempts: ${attempts}`;
    }

    function restartGame() {
        generateRandomNumbers();
        playerInput.value = '';
        resultParagraph.textContent = '';
        attemptsParagraph.textContent = '';
        submitButton.disabled = false;
        restartButton.style.display = 'none';
    }

    generateRandomNumbers();

    submitButton.addEventListener('click', handleGuess);
    restartButton.addEventListener('click', restartGame);
});
