/*
====================================================================
ROCK PAPER SCISSORS GAME - JAVASCRIPT FILE
====================================================================
This JavaScript file contains all the game logic:
- Stores game state (scores)
- Handles player and computer choices
- Determines winners
- Updates the HTML display
====================================================================
*/

/* 
GLOBAL VARIABLES: Accessible from anywhere in the code
let = can be changed later (unlike const)
*/

/* Keeps track of player's total score */
let playerScore = 0;

/* Keeps track of computer's total score */
let computerScore = 0;

/*
CONSTANTS: Values that don't change during the game
const = cannot be changed (permanent)
*/

/* Array of all possible choices in the game */
const choices = ['rock', 'paper', 'scissors'];

/* Object mapping choice names to emoji symbols
   Key-value pairs: 'rock' => '🪨', etc.
   This makes it easy to get the emoji for any choice
*/
const choiceEmojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

/*
FUNCTION: getComputerChoice()
Purpose: Make computer choose a random choice

Math.random() = generates number between 0 and 1 (like 0.523)
* choices.length = multiply by 3 (number of choices) = 0 to 3
Math.floor() = round down to whole number = 0, 1, or 2
choices[...] = use that number as index to pick from array
*/
function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

/*
FUNCTION: determineWinner(playerChoice, computerChoice)
Purpose: Compare player and computer choices and determine the winner

Parameters:
  - playerChoice: what the player chose ('rock', 'paper', or 'scissors')
  - computerChoice: what the computer chose (also 'rock', 'paper', or 'scissors')

Returns: 'tie', 'win', or 'lose'

Game rules:
  Rock beats Scissors (rock crushes scissors)
  Scissors beats Paper (scissors cut paper)
  Paper beats Rock (paper covers rock)
*/
function determineWinner(playerChoice, computerChoice) {
    /* 
    === (strict equality) checks if both values are exactly the same
    If both chose the same thing, it's a tie
    */
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    /* 
    Check all winning conditions for player
    || (OR operator) means if ANY of these conditions is true
    && (AND operator) means both conditions must be true
    */
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    }

    /* If it's not a tie and not a win, it must be a loss */
    return 'lose';
}

/*
FUNCTION: updateDisplay(playerChoice, computerChoice, result)
Purpose: Update all the HTML elements to show the game result

This function:
1. Shows both choices as emojis
2. Displays win/lose/tie message
3. Updates scores
4. Triggers animations

DOM Manipulation:
document.getElementById() finds HTML element by its ID
.textContent changes the text inside an element
.className changes the CSS class applied to element
*/
function updateDisplay(playerChoice, computerChoice, result) {
    /* 
    Display player's choice emoji
    choiceEmojis[playerChoice] gets emoji from our object
    Example: choiceEmojis['rock'] returns '🪨'
    */
    document.getElementById('playerChoice').textContent = choiceEmojis[playerChoice];
    
    /* Display computer's choice emoji */
    document.getElementById('computerChoice').textContent = choiceEmojis[computerChoice];

    /* 
    Find the result text element to update
    const creates local variable that can't be changed
    */
    const resultText = document.getElementById('resultText');
    
    /* 
    Change CSS class based on result
    className changes which CSS styles apply to the element
    Result can be 'win', 'lose', or 'tie' (different colors in CSS)
    */
    resultText.className = 'result-text ' + result;

    /* 
    Check result and update accordingly:
    === checks for exact match
    */
    if (result === 'win') {
        resultText.textContent = '🎉 YOU WIN! 🎉';
        playerScore++;  /* Add 1 to player score */
    } else if (result === 'lose') {
        resultText.textContent = '💻 COMPUTER WINS! 💻';
        computerScore++;  /* Add 1 to computer score */
    } else {
        /* result === 'tie' */
        resultText.textContent = "🤝 IT'S A TIE! 🤝";
        /* No score increase for ties */
    }

    /* Update the score displays on the page */
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;

    /* Call function to add animation effect */
    animateChoices();
}

/*
FUNCTION: animateChoices()
Purpose: Add a "pulse" animation effect to the choice displays

Why we need this trick:
- If we just apply animation again, browser doesn't restart it
- So we first set animation to 'none' to reset it
- Then immediately apply the animation again
- setTimeout adds delay to let browser process the reset

.style.animation accesses the CSS animation property directly from JavaScript
*/
function animateChoices() {
    /* Get references to the choice emoji elements */
    const playerChoiceEl = document.getElementById('playerChoice');
    const computerChoiceEl = document.getElementById('computerChoice');

    /* 
    Remove any existing animation
    This "resets" the animation so we can trigger it again
    */
    playerChoiceEl.style.animation = 'none';
    computerChoiceEl.style.animation = 'none';

    /* 
    setTimeout() delays code execution
    Waits 10 milliseconds, then applies animation
    This delay lets browser reset the animation
    
    Arrow function: () => { } is modern JavaScript syntax for function
    */
    setTimeout(() => {
        /* Apply pulse animation for 0.5 seconds */
        playerChoiceEl.style.animation = 'pulse 0.5s ease-out';
        computerChoiceEl.style.animation = 'pulse 0.5s ease-out';
    }, 10);
}

/*
FUNCTION: playerPlay(choice)
Purpose: Main function called when player clicks a button

This is the "flow" of a single game turn:
1. Computer makes random choice
2. Determine winner
3. Update display with result
4. Disable buttons during animation
5. Re-enable buttons after animation

Flow of execution (order matters!):
*/
function playerPlay(choice) {
    /* 
    Step 1: Get computer's choice
    Call getComputerChoice() and store result in computerChoice variable
    */
    const computerChoice = getComputerChoice();
    
    /* 
    Step 2: Determine winner
    Call determineWinner() with both choices
    Returns 'win', 'lose', or 'tie'
    */
    const result = determineWinner(choice, computerChoice);
    
    /* 
    Step 3: Update all display elements
    Shows emojis, result text, and new scores
    */
    updateDisplay(choice, computerChoice, result);

    /* 
    Step 4: Disable buttons to prevent rapid clicking
    .disabled property prevents button clicks
    */
    disableButtons(true);
    
    /* 
    Step 5: Re-enable buttons after animation finishes
    setTimeout() waits 500 milliseconds (0.5 seconds)
    Then calls disableButtons(false) to enable them again
    This matches the animation duration
    */
    setTimeout(() => {
        disableButtons(false);
    }, 500);
}

/*
FUNCTION: disableButtons(disabled)
Purpose: Enable or disable all three choice buttons

Parameters:
  disabled: true = disable buttons (can't click)
           false = enable buttons (can click)

The .disabled property exists on HTML button elements
Setting it to true grays out the button and prevents clicks
*/
function disableButtons(disabled) {
    /* Disable/enable Rock button */
    document.getElementById('rockBtn').disabled = disabled;
    
    /* Disable/enable Paper button */
    document.getElementById('paperBtn').disabled = disabled;
    
    /* Disable/enable Scissors button */
    document.getElementById('scissorsBtn').disabled = disabled;
}

/*
FUNCTION: resetGame()
Purpose: Reset all game state to initial values

Called when player clicks "Reset Game" button
Clears all scores and resets display to starting state
*/
function resetGame() {
    /* Reset score variables to 0 */
    playerScore = 0;
    computerScore = 0;
    
    /* Update all HTML elements to show initial state */
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
    
    /* Reset choice displays to "-" (no choice made) */
    document.getElementById('playerChoice').textContent = '-';
    document.getElementById('computerChoice').textContent = '-';
    
    /* Reset result message to starting text */
    document.getElementById('resultText').textContent = 'Make your move!';
    
    /* Reset result text to default styling (no win/lose/tie class) */
    document.getElementById('resultText').className = 'result-text';
    
    /* Enable buttons so player can play again */
    disableButtons(false);
}

/*
ANIMATION CREATION
Create and inject CSS animation rules into page

document.createElement('style') creates a new <style> element
.textContent sets the CSS code inside it
@keyframes defines an animation called "pulse"
document.head.appendChild() adds it to the page
*/
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        /* 0% = animation start - normal size */
        0% {
            transform: scale(1);  /* scale(1) = 100% of original size */
        }
        /* 50% = middle of animation - grow bigger */
        50% {
            transform: scale(1.2);  /* scale(1.2) = 120% size (20% bigger) */
        }
        /* 100% = end of animation - back to normal */
        100% {
            transform: scale(1);  /* Back to original size */
        }
    }
`;
/* Add the animation to the page by putting it in the <head> */
document.head.appendChild(style);

/*
PAGE INITIALIZATION
window.addEventListener() waits for an event to happen
'DOMContentLoaded' = fires when all HTML is loaded and ready

This ensures all HTML elements exist before we try to access them
*/
window.addEventListener('DOMContentLoaded', () => {
    /* Initialize score displays when page first loads */
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
});
