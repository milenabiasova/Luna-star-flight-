// Importing game objects from their respective files

import {Luna} from "./game_objects/luna.js";
import {Obstacle} from "./game_objects/tree.js";
import {Stars} from "./game_objects/star.js";

// Game variables
// Retrieve and store the background music element from the HTML document
const backgroundMusic = document.getElementById('backgroundMusic');

// Retrieve and store the button element for toggling music from the HTML document
const toggleMusicBtn = document.getElementById('toggleMusicBtn');

// Variable to keep track of the music playing state
let isMusicPlaying = false;

// Retrieve and store the sound effect for collecting stars from the HTML document
const starCollectSound = document.getElementById('starSound');

// Retrieve and store the canvas element from the HTML document
const canvas = document.getElementById('gameCanvas');

// Get the 2D rendering context for the canvas
const canvasContext = canvas.getContext("2d");

// Disable image smoothing to keep pixel art crisp
canvasContext.imageSmoothingEnabled = false;

// Set canvas dimensions to the window's inner width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create a new Image object for the background
let backgroundImage = new Image();

// Set the source for the background image
backgroundImage.src = 'images/starsb.png';

// Draw the background image once it's loaded
backgroundImage.onload = function() {
    canvasContext.drawImage(backgroundImage, 0, 0, window.innerWidth, window.innerHeight);
};

// Variables for animating the moving background
let movingBackgroundX = 0;
let movingBackgroundSpeed = 2;

// Preloading star images with specified dimensions and positions
const starsImages = [
    {src: 'images/star.png', width: window.innerWidth*0.03, height: window.innerHeight*0.07, y: window.innerHeight*0.7},
    {src: 'images/star.png', width: window.innerWidth*0.03, height: window.innerHeight*0.07, y: window.innerHeight*0.575},
    {src: 'images/star.png', width: window.innerWidth*0.03, height: window.innerHeight*0.07, y: window.innerHeight*0.45},
    {src: 'images/star.png', width: window.innerWidth*0.03, height: window.innerHeight*0.07, y: window.innerHeight*0.325},
    {src: 'images/star.png', width: window.innerWidth*0.03, height: window.innerHeight*0.07, y: window.innerHeight*0.2},
]

// Preloading tree images with specified dimensions and positions
const treeImages  = [
    { src: 'images/tree1.png', width: window.innerWidth*0.16, height: window.innerHeight*0.7, y: window.innerHeight*0.34},
    { src: 'images/tree2.png', width: window.innerWidth*0.13, height: window.innerHeight*0.56, y: window.innerHeight*0.45},
    { src: 'images/tree3.png', width: window.innerWidth*0.16, height: window.innerHeight*0.7, y: window.innerHeight*0.34},
    { src: 'images/tree4.png', width: window.innerWidth*0.13, height: window.innerHeight*0.62, y: window.innerHeight*0.43},
    { src: 'images/tree5.png', width: window.innerWidth*0.16, height: window.innerHeight*0.7, y: window.innerHeight*0.34}
];
// Object containing images for different game states (start, win, lose)
const backgrounds = {
    start: new Image(),
    win: new Image(),
    lose: new Image()
};
// Setting the source for start, win, and lose background images
backgrounds.start.src = 'images/nostars3.png';
backgrounds.win.src = 'images/finalbutton1.png';
backgrounds.lose.src = 'images/finalgameover.png';

// Variable to hold the current background (initially set to the start background)
let currentBackground = backgrounds.start;

// Creating the Luna (owl) object with specified dimensions and sprite sheet
let owl = new Luna(window.innerWidth/4, window.innerHeight/4, window.innerWidth*0.12, window.innerHeight*0.15, "images/luna.png", 4,2);

// Variables for managing game obstacles and stars
let obstacleTimeout;
let starTimeout;
let timeouts = [];
let obstacles = [];
let stars = [];

// Constant for minimum distance between a star and a tree
const minDistanceBetweenStarAndTree = 100;

// Variable to keep track of the number of collected stars
let collectedStars = 0;

// Constant for the maximum number of stars in the game
const maxStars = 50;

// Variables for tracking and updating the game's progress
let currentProgress = 0;
let targetProgress = 0;

// Boolean variable to check if the game is over
let isGameOver = false;

// Variable for controlling the game's speed
let gameSpeed = 1;
let isGamePaused = false;

// Event listeners for the start button, to hide the button and start the game.
const button = document.getElementById('myButton');
button.addEventListener('click', function() {
    this.style.display = 'none'; // hides the button
    document.getElementById('storyText').style.display = 'none';// hides text
    startGame();
});

// Event listener for the restart button, to restart the game when clicked.
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', restartGame);

// Event listener for spacebar keydown, to make the owl character jump.
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        owl.jump();
    }
})

// Event listener for the music toggle button.
toggleMusicBtn.addEventListener('click', toggleBackgroundMusic);

// Event listener for 'P' keydown, to pause and unpause the game.
document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyP') {
        togglePause();
    }
});

// Function for reloading images
function reloadImagesAndRestartGame() {
    const imagesToLoad = [
        'images/starsb.png',
        'images/nostars3.png',
        'images/finalbutton1.png',
        'images/finalgameover.png',
        'images/star.png',
        'images/tree1.png',
        'images/tree2.png',
        'images/tree3.png',
        'images/tree4.png',
        'images/tree5.png',
        'images/luna.png'
    ];

    let loadedImagesCount = 0;

    imagesToLoad.forEach(src => {
        const img = new Image();
        img.onload = () => {
            loadedImagesCount++;
            if (loadedImagesCount === imagesToLoad.length) {
                allImagesLoaded = true;
            }
        };
        img.src = src;
    });
}


document.getElementById('restartButton').addEventListener('click', reloadImagesAndRestartGame);

// Function to draw the star count on the canvas.
function drawStarCount() {
    canvasContext.font = '24px Josefin Sans'; // Set the font size and style
    canvasContext.fillStyle = 'gold'; // Set the text color
    canvasContext.textAlign = 'right'; // Align text to the right
    const text = `${collectedStars}/${maxStars}`;
    canvasContext.fillText(text, canvas.width - 70, 70); // Position the text
}

// Function to toggle the game's pause state.
function togglePause() {
    isGamePaused = !isGamePaused;
    if (!isGamePaused) {
        gameLoop(); // If paused, call gameLoop to resume the game
    }
}

// Function to toggle background music on and off.
function toggleBackgroundMusic() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }
    isMusicPlaying = !isMusicPlaying;
    toggleMusicBtn.textContent = isMusicPlaying ? 'Turn Music Off' : 'Turn Music On';
}

// Function to gradually increase the game's speed.
function increaseGameSpeed() {
    gameSpeed += 0.1; // Adjust the increment value as needed
}

// Function to animate the progress bar's current progress.
function updateProgress (){
    if (currentProgress<targetProgress){
        currentProgress += 0.01; //speed of animation
        if (currentProgress>targetProgress) {
            currentProgress=targetProgress;
        }
    }
}

// Function to update the width and position of the progress bar.
function updateProgressBar(progress) {
    // Update progress bar width
    document.getElementById('progressBar').style.width = progress + '%';

    // Getting the container width for the progress bar
    let containerWidth = document.getElementById('progressContainer').offsetWidth;

    // Calculation of the new star position
    // The position of the star depends on the percentage of progress and the width of the container
    let newLeft = (progress / 100) * containerWidth;

    // Setting a new position for the star
    // Offsets the star by half its width so that it remains centered relative to the current end of the progress bar
    newLeft -= document.getElementById('starIndicator').offsetWidth / 2;

    //  ensure that the star does not extend beyond the container
    newLeft = Math.max(0, Math.min(newLeft, containerWidth - document.getElementById('starIndicator').offsetWidth));

    document.getElementById('starIndicator').style.left = newLeft + 'px';
}

// Function to handle star collection logic.
function collectStar (){
    collectedStars++; // Increment the number of collected stars
    starCollectSound.currentTime = 0;// Reset the star collection sound
    starCollectSound.play();// Play the star collection sound
    targetProgress = collectedStars / maxStars; // Update the target progress based on the number of collected stars
    updateProgressBar((collectedStars / maxStars) * 100);// Update the progress bar
    if (collectedStars % 10 === 0) { // Increase game speed every 10 stars collected
        increaseGameSpeed();
    }
    if (collectedStars >= maxStars) {
        endGame(); // End the game if the maximum number of stars is collected
    }
}

// Function to start the game, hiding UI elements and starting the game loop.
function startGame() {
    owl = new Luna(window.innerWidth/4, window.innerHeight/4, window.innerWidth*0.12, window.innerHeight*0.15, "images/luna.png", 4, 2);
    console.log("Starting game1");
    document.getElementById('toggleMusicBtn').style.display = 'none';// Hide the music toggle button
    currentBackground = backgrounds.start;// Set the current background to the start background
    document.getElementById('progressContainer').style.display = 'block';// Show the progress bar container
    if (isMusicPlaying) {
        backgroundMusic.play();
    }
    drawBackground();// Draw the background
    gameLoop();// Start the main game loop
    addObstacle ();// Add the first obstacle
    addStar (); // Add the first star
}

// Function to handle the game ending logic, displaying the win screen.
function endGame() {
    const winningSound = document.getElementById('winningSound');
    winningSound.play(); // Play the winning sound effect
    if (isMusicPlaying) {
        backgroundMusic.pause();// Pause the background music
        backgroundMusic.currentTime = 0;// Reset the background music
        isMusicPlaying = false;// Set the music playing state to false
    }
    isGameOver = true;// Set the game over state to true
    currentBackground = backgrounds.win;// Set the current background to the win background
    drawBackground(); // Draw the background
    restartButton.style.display = 'block';// Show the restart button
    document.getElementById('progressContainer').style.display = 'none';// Hide the progress bar container
    stars = [];// Clear the stars array
    restartButton.style.position = 'absolute';// Position the restart button absolutely
    restartButton.style.left = '51%';// Set the horizontal position of the restart button
    restartButton.style.top = '56%';// Set the vertical position of the restart button
}

// Function to handle the game over logic, displaying the loose screen.
function loseGame() {
    backgroundMusic.pause();// Pause the background music
    isMusicPlaying = false;// Set the music playing state to false
    const gameOverSound = document.getElementById('gameOverSound');
    gameOverSound.play();// Play the game over sound effect
    if (isMusicPlaying) {
        backgroundMusic.pause();// Pause the background music
        backgroundMusic.currentTime = 0;// Reset the background music
        isMusicPlaying = false; // Set the music playing state to false
    }
    currentBackground = backgrounds.lose;// Set the current background to the loose background
    drawBackground(); // Draw the background
    isGameOver = true; // Set the game over state to true
    canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    canvasContext.drawImage(currentBackground, 0, 0, canvas.width, canvas.height); // Draw the game over background
    restartButton.style.display = 'block'; // Show the restart button
    document.getElementById('progressContainer').style.display = 'none'; // Hide the progress bar container
    stars = []; // Clear the stars array
    restartButton.style.left = '51%'; // Set the horizontal position of the restart button
    restartButton.style.top = '48%'; // Set the vertical position of the restart button
}

// Function to restart the game
function restartGame() {
    if (!allImagesLoaded) {
        // Если изображения еще не загружены, выходим из функции
        return;
    }
    backgroundMusic.play(); // Play the background music
    isMusicPlaying = true; // Set the music playing state to true
    owl = new Luna(window.innerWidth / 4, window.innerHeight / 4, window.innerWidth * 0.12, window.innerHeight * 0.16, "images/luna.png", 4, 2);
    clearTimeout(obstacleTimeout);
    clearTimeout(starTimeout);
    timeouts.forEach(timeoutId => clearTimeout(timeoutId)); // Clear all timeouts
    gameSpeed = 1; // Reset the game speed
    timeouts = []; // Clear the timeouts array
    obstacles = []; // Clear the obstacles array
    stars = []; // Clear the stars array
    collectedStars = 0; // Reset the number of collected stars
    currentProgress = 0; // Reset the current progress
    targetProgress = 0; // Reset the target progress
    owl = new Luna(window.innerWidth/4, window.innerHeight/4, window.innerWidth*0.12, window.innerHeight*0.16, "../images/luna.png", 4, 2); // Recreate the owl object
    isGameOver = false; // Reset the game over state
    restartButton.style.display = 'none'; // Hide the restart button
    document.getElementById('progressContainer').style.display = 'none'; // Hide the progress bar container
    startGame(); // Start the game
    updateProgressBar(0); // Reset and update the progress bar
}
let allImagesLoaded = false;
// Main game loop function, handling game updates and rendering.
function gameLoop() {
    if (isGamePaused) {
        return; // Return immediately if the game is paused
    }
    if (!isGameOver) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
        canvasContext.drawImage(currentBackground, 0, 0, canvas.width, canvas.height); // Draw the current background on the canvas
        updateBackground(); // Update the background (for animated backgrounds)
        drawBackground(); // Draw the background
        drawStarCount(); // Draw the current star count on the screen
        owl.update(); // Update the owl's position or state
        owl.draw(canvasContext); // Draw the owl on the canvas

        // Loop through each obstacle and handle its logic
        obstacles.forEach(obstacle => {
            obstacle.update(); // Update the obstacle's position or state
            obstacle.draw(canvasContext); // Draw the obstacle on the canvas
            if (isCollidingOwlTree(owl, obstacle)) {
                loseGame(); // If the owl collides with an obstacle, the player loses
            }
        });

        // Loop through each star for collision detection
        for (let i = stars.length - 1; i >= 0; i--) { //This loop iterates through the stars array in reverse order. Starting from the last element (stars.length - 1) and going backwards to the first element (i >= 0). Iterating in reverse is particularly useful when you might remove elements from the array during the iteration, which is the case here.
            const star = stars[i]; //For each iteration, this line accesses the current star in the array using the index i.
            if (star && isCollidingWithStar(owl, star)) { // This checks two things: a) star: Ensures that the current star is not undefined or null.b) isCollidingWithStar(owl, star): Calls a function to check if there's a collision between the owl and the current star.
                stars.splice(i, 1); // Remove the star from the array if it collides with the owl. The splice method is used here to remove the element at index i. It's crucial to do this to prevent further processing of the star that's already been collided with.
                collectStar(); // Handle the logic for when a star is collected
            } else if (star) {
                star.update(); // Update the star's position or state
                star.draw(canvasContext); // Draw the star on the canvas
            }
        }

        if (owl.y < 0 || owl.y + owl.height > canvas.height) {
            loseGame(); // End the game if the owl is out of bounds
        }
        updateProgress(); // Update the game progress (like score or time)
        requestAnimationFrame(gameLoop); // Request the next frame to keep the loop running
    }
}

function addObstacle() {
    const treeIndex = Math.floor(Math.random() * treeImages.length); // Randomly select a tree image
    // This line uses the randomly chosen index (treeIndex) to access an element from the treeImages array.
    // The element accessed is a tree image, and it's stored in the tree variable.
    const tree = treeImages[treeIndex];

    // Create a new obstacle using the chosen tree image
    const newObstacle = new Obstacle(canvas.width, tree.y, tree.width, tree.height, tree.src);

    if (!isOverlapping(newObstacle)) {
        obstacles.push(newObstacle); // Add the new obstacle to the array if it doesn't overlap with others
    }

    // Calculate a random time interval for the next obstacle
    const maxInterval = 2000;
    const minInterval = 1000;
    const nextTreeInterval = Math.random() * (maxInterval - minInterval) + minInterval;

    clearTimeout(obstacleTimeout); // Clear the previous timeout
    obstacleTimeout = setTimeout(addObstacle, nextTreeInterval); // Set a new timeout to add another obstacle
    timeouts.push(obstacleTimeout); // Store the timeout for future clearing
}

function addStar() {
    //This line randomly selects an index for the starsImages array, which contains images of stars.
    // The Math.random() function generates a random number, which is then scaled to the size of the starsImages array and rounded down
    // to an integer to serve as a valid array index
    const starIndex = Math.floor(Math.random() * starsImages.length); // Randomly select a star image

    //This line retrieves the star image from the starsImages array using the randomly chosen index.
    const star = starsImages[starIndex];

    // Create a new star using the chosen image
    const newStar = new Stars(canvas.width, star.y, star.width, star.height, star.src);


    const isTooCloseToTree = obstacles.some(obstacle => {
        return Math.abs(newStar.x - obstacle.x) < minDistanceBetweenStarAndTree &&
            Math.abs(newStar.y - obstacle.y) < minDistanceBetweenStarAndTree;
    });

    // Add the star if it's not too close to obstacles and not overlapping with other stars
    if (!isTooCloseToTree) { // This condition checks if the star is not too close to any tree. If true, it proceeds to the next check.
        if (!isOverlapping(newStar) && !stars.some(existingStar => isOverlapping(newStar, existingStar))) { // These conditions check whether the new star is not overlapping with any existing game elements, including other stars. It uses the isOverlapping function to determine if the new star's space is already occupied.
            stars.push(newStar); //If the new star passes all checks (not too close to obstacles and not overlapping with other stars), it is added to the stars array, which likely keeps track of all the stars currently in the game
        }
    }

    // Calculate a random time interval for the next star
    const maxInterval = 750;
    const minInterval = 250;
    const nextStarInterval = Math.random() * (maxInterval - minInterval) + minInterval;

    clearTimeout(starTimeout); // Clear the previous timer for star generation
    starTimeout = setTimeout(addStar, nextStarInterval); // Set a new timer for the next star generation
    timeouts.push(starTimeout); // Store the timer for future reference
}

function drawBackground() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas

    // Draw the moving background if the current background is the starting one
    if (currentBackground === backgrounds.start) {
        canvasContext.drawImage(backgrounds.start, movingBackgroundX, 0, canvas.width, canvas.height);
        canvasContext.drawImage(backgrounds.start, movingBackgroundX + canvas.width, 0, canvas.width, canvas.height);
    } else {
        canvasContext.drawImage(currentBackground, 0, 0, canvas.width, canvas.height); // Draw the static background
    }
}

// Is overlapping function checks whether the rectangular area represented by newObstacle intersects with the rectangular area
// of the existing obstacles in the array.

function isOverlapping(newObstacle) {
    for (const obstacle of obstacles) { // This loop iterates over each obstacle in the obstacles array. Each obstacle in the array is checked against the newObstacle to see if they overlap.
        // Check if the new obstacle overlaps with any existing obstacle
        if (newObstacle.x < obstacle.x + obstacle.width && //This checks if the left edge of newObstacle is to the left of the right edge of obstacle. If this is true, it means newObstacle is at least partially horizontally aligned with obstacle.
            newObstacle.x + newObstacle.width > obstacle.x && // This checks if the right edge of newObstacle is to the right of the left edge of obstacle. This further confirms that newObstacle overlaps horizontally with obstacle.
            newObstacle.y < obstacle.y + obstacle.height && // This checks if the top edge of newObstacle is above the bottom edge of obstacle, indicating a vertical overlap.
            newObstacle.y + newObstacle.height > obstacle.y) { // This checks if the bottom edge of newObstacle is below the top edge of obstacle, confirming the vertical overlap.
            return true; // Return true if there's an overlap
        }
    }
    return false; // Return false if there's no overlap
}

function isCollidingOwlTree(owl, tree) {
    const buffer = 80; // Define a buffer to prevent too sensitive collision
    return owl.x < tree.x + tree.width - buffer &&
       // This checks if the right edge of the owl (owl.x + owl.width) is to the right of the left edge of the tree (tree.x) plus the buffer.
       // This confirms that the owl overlaps horizontally with the tree.
        owl.x + owl.width > tree.x + buffer &&
        //checks if the top edge of the owl (owl.y) is above the bottom edge of the tree (tree.y + tree.height) minus the buffer,
        // indicating a vertical overlap.
        owl.y < tree.y + tree.height - buffer &&
        // checks if the bottom edge of the owl (owl.y + owl.height) is below the top edge of the tree (tree.y) plus the buffer,
        // further confirming the vertical overlap.
        owl.y + owl.height > tree.y + buffer;
}


// isCollidingWithStar function checks for a collision by seeing if the owl's bounding box intersects with the star's bounding box.
function isCollidingWithStar(owl, star) {
    // Check if the owl collides with the star
    // checks if the left edge of the owl (owl.x) is to the left of the right edge of the star (star.x + star.width).
    // If this is true, the owl is at least partially horizontally aligned with the star on its right side.
    return owl.x < star.x + star.width &&
        // checks if the right edge of the owl (owl.x + owl.width) is to the right of the left edge of the star (star.x).
        // This condition confirms that the owl overlaps horizontally with the star on its left side.
        owl.x + owl.width > star.x &&
        // checks if the top edge of the owl (owl.y) is above the bottom edge of the star (star.y + star.height).
        // If true, the owl is at least partially vertically aligned with the star on its bottom side
        owl.y < star.y + star.height &&
        //  checks if the bottom edge of the owl (owl.y + owl.height) is below the top edge of the star (star.y).
        //  This condition confirms that the owl overlaps vertically with the star on its top side.
        owl.y + owl.height > star.y;
}
// Update the background
function updateBackground() {
    // Update the background for animated backgrounds
    if (currentBackground === backgrounds.start) {
        movingBackgroundX -= movingBackgroundSpeed * gameSpeed; // Move the background
        if (movingBackgroundX <= -canvas.width) {
            movingBackgroundX = 0; // Reset the background position
        }
    }
}

// Export the necessary variables and constants
export {canvas, canvasContext, backgroundImage, isGameOver, gameSpeed}
