document.addEventListener('DOMContentLoaded', () => {
    const playerInput = document.getElementById('player-numbers');
    const submitButton = document.getElementById('submit');
    const resultParagraph = document.getElementById('result');
    const attemptsParagraph = document.getElementById('attempts');
    const restartButton = document.getElementById('restart');
    const computerGuessParagraph = document.getElementById('computer-guess');
    const dynamicText = document.getElementById('dynamic-text');
    const guessOptions = document.getElementById('guess-options');
    const guessOptionButtons = document.querySelectorAll('.guess-option');

    let computerNumbers = [];
    let playerNumbers = [];
    let attempts = 0;
    let computerGuess = [];
    let computerGuessedCorrectly = false;
    let previousComputerGuesses = [];

    function generateRandomNumbers() {
        computerNumbers = [];
        while (computerNumbers.length < 3) {
            const num = Math.floor(Math.random() * 9) + 1; // Random number between 1 and 10
            if (!computerNumbers.includes(num)) {
                computerNumbers.push(num);
            }
        }
        console.log('Computer Numbers:', computerNumbers); // For debugging
    }

    function generateComputerGuess() {
        let guess;
        do {
            guess = [];
            while (guess.length < 3) {
                const num = Math.floor(Math.random() * 9) + 1; // Random number between 1 and 10
                guess.push(num); // Allow duplicates in computer's guess
            }
        } while (previousComputerGuesses.some(pastGuess => JSON.stringify(pastGuess) === JSON.stringify(guess)));

        previousComputerGuesses.push(guess);
        return guess;
    }

    function evaluateGuess(guess, target) {
        let correctNumbers = 0;
        let correctPositions = 0;

        // Arrays to keep track of which positions have been matched
        let targetUsed = Array(target.length).fill(false);
        let guessUsed = Array(guess.length).fill(false);

        // First pass: Check for correct positions
        guess.forEach((num, index) => {
            if (target[index] === num) {
                correctPositions++;
                targetUsed[index] = true;
                guessUsed[index] = true;
            }
        });

        // Second pass: Check for correct numbers in wrong positions
        guess.forEach((num, index) => {
            if (!guessUsed[index]) {
                const targetIndex = target.indexOf(num);
                if (targetIndex !== -1 && !targetUsed[targetIndex]) {
                    correctNumbers++;
                    targetUsed[targetIndex] = true;
                }
            }
        });

        return { correctNumbers, correctPositions };
    }

    function handlePlayerGuess() {
        playerNumbers = playerInput.value.split(/\s+/).map(num => parseInt(num.trim(), 10));

        if (playerNumbers.length !== 3 || playerNumbers.some(isNaN)) {
            resultParagraph.textContent = 'Please enter exactly 3 valid numbers separated by spaces.';
            playerInput.classList.add('shake');
            setTimeout(() => playerInput.classList.remove('shake'), 500); // Remove the class after the animation
            return;
        }

        attempts++;
        computerGuess = generateComputerGuess();
        const playerEvaluation = evaluateGuess(playerNumbers, computerNumbers);
        const computerEvaluation = evaluateGuess(computerGuess, playerNumbers);

        resultParagraph.textContent = `Your guess: ${playerNumbers.join(' ')} - ${playerEvaluation.correctPositions} in the correct position, ${playerEvaluation.correctNumbers} correct number(s) in the wrong position.`;
        computerGuessParagraph.textContent = `Computer's guess: ${computerGuess.join(' ')} - ${computerEvaluation.correctPositions} in the correct position, ${computerEvaluation.correctNumbers} correct number(s) in the wrong position.`;

        if (playerEvaluation.correctPositions === 3) {
            resultParagraph.textContent = `Congratulations! You guessed all 3 numbers correctly in ${attempts} attempts.`;
            submitButton.disabled = true;
            restartButton.style.display = 'inline';
            guessOptions.style.display = 'none'; // Hide guess options
        } else if (computerEvaluation.correctPositions === 3) {
            resultParagraph.textContent = `Computer wins! The computer guessed all 3 numbers correctly: ${computerGuess.join(' ')}.`;
            submitButton.disabled = true;
            restartButton.style.display = 'inline';
            guessOptions.style.display = 'none'; // Hide guess options
        } else {
            guessOptions.style.display = 'block'; // Show guess options for the next player move
        }

        attemptsParagraph.textContent = `Attempts: ${attempts}`;
    }

    function handleGuessOptionClick(event) {
        const selectedCorrect = parseInt(event.target.dataset.correct, 10);

        if (!computerGuessedCorrectly) {
            const computerGuessEvaluation = evaluateGuess(computerGuess, computerNumbers);

            if (selectedCorrect === computerGuessEvaluation.correctNumbers) {
                resultParagraph.textContent = `Computer guessed correctly with ${computerGuessEvaluation.correctNumbers} numbers.`;
                computerGuessedCorrectly = true;
                guessOptions.style.display = 'none'; // Hide guess options since computer has guessed correctly
            } else {
                resultParagraph.textContent = `Computer's guess was ${computerGuess.join(' ')}. You chose ${selectedCorrect} correct, which is incorrect.`;
                guessOptions.style.display = 'none'; // Hide guess options until next round
            }
        }
    }

    function restartGame() {
        generateRandomNumbers();
        playerInput.value = '';
        resultParagraph.textContent = '';
        attemptsParagraph.textContent = '';
        computerGuessParagraph.textContent = '';
        guessOptions.style.display = 'none'; // Hide guess options
        submitButton.disabled = false; // Enable the submit button for new round
        previousComputerGuesses = []; // Reset previous guesses
        computerGuessedCorrectly = false; // Reset the computer's guess state
        dynamicText.textContent = 'Guess the 3 numbers chosen by the computer.';
    }

    // Add focus animation to the input box
    playerInput.addEventListener('focus', () => {
        playerInput.classList.add('pulse');
    });

    playerInput.addEventListener('blur', () => {
        playerInput.classList.remove('pulse');
    });

    generateRandomNumbers();
    dynamicText.textContent = 'Guess the 3 numbers chosen by the computer.';

    submitButton.addEventListener('click', handlePlayerGuess);
    guessOptionButtons.forEach(button => button.addEventListener('click', handleGuessOptionClick));
    restartButton.addEventListener('click', restartGame);
});
