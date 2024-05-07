import {GameObject} from "./game object.js";
import {gameSpeed} from "../script.js";

// Define the Luna class as a subclass of GameObject
 class Luna extends GameObject {
    constructor(x, y, width, height, imageSrc, frameColumns, frameRows) {
        super(x, y, width, height, imageSrc);// Call the parent class constructor
        this.frameColumns = frameColumns;// Number of columns in the sprite sheet
        this.frameRows = frameRows;// Number of rows in the sprite sheet
        this.currentFrame = 0; // Current frame for animation
        this.tickCount = 0; // Counter to control frame switching speed
        this.ticksPerFrame = 20;// Number of ticks before switching frames
        this.velocityY = 0;// Initial vertical velocity
        this.gravity = 0.5;// Gravity affecting the character

        // Set the frame width and height after the image has loaded
        this.image.onload = () => {
            this.frameWidth = this.image.width / this.frameColumns;// Inside the event handler, this line calculates the width of each frame in the sprite sheet. It does so by dividing the total width of the image (this.image.width) by the number of columns (this.frameColumns) in the sprite sheet.
            this.frameHeight = this.image.height / this.frameRows; // Similarly, this line calculates the height of each frame in the sprite sheet by dividing the total height of the image (this.image.height) by the number of rows (this.frameRows) in the sprite sheet.
        };
    }

    // Method to make Luna jump
    jump() {
        this.velocityY = -window.innerHeight * 0.014; // Set upward velocity
    }

     // Override the update method from GameObject
     update() {
        this.tickCount += 3;// increments the tickCount property by 3 in each frame update. The tickCount is used to control the animation speed

        if (this.tickCount > this.ticksPerFrame) { // This condition checks if enough time has passed to switch to the next frame of the animation.
            // this.ticksPerFrame specifies the number of ticks (time units) needed to change frames.
            // If tickCount exceeds this value, it means it's time to update the frame.
            this.tickCount = 0; // If the condition is met, tickCount is reset to 0 to start counting again for the next frame.
            this.currentFrame = (this.currentFrame + 1) % (this.frameRows * this.frameColumns); // updates the currentFrame property to the next frame in the sprite sheet.
            // It ensures that currentFrame loops back to 0 when it reaches the end of the animation.
            //  the modulo operation is used to ensure that the currentFrame property loops back to 0 when it reaches the end of the animation sequence.
        }
// updates the vertical velocity (velocityY) of Luna based on gravity and game speed.
// Gravity is a constant force pulling Luna downwards, and gameSpeed can make this force stronger or weaker depending on the game's speed settings
        this.velocityY += this.gravity * gameSpeed; // Apply game speed to gravity
        this.y += this.velocityY;//  updates Luna's vertical position (y) based on the calculated velocityY.
                                 // This simulates Luna's movement due to gravity, causing Luna to fall or rise if she jumped.
    }

    // draw method uses the sprite sheet and the current frame index to draw the correct frame of Luna's animation on the canvas.
     draw(canvasContext) {
         canvasContext.drawImage(
             this.image,
             //this.currentFrame is the current frame index.
             // % this.frameColumns ensures that currentFrame wraps around if it exceeds the number of columns in the sprite sheet.
             // This helps select the correct column of frames.
             // * this.frameWidth calculates the X-coordinate by multiplying the frame index by the width of each frame.
             this.currentFrame % this.frameColumns * this.frameWidth, Math.floor(this.currentFrame / this.frameColumns) * this.frameHeight,
             // this.currentFrame is divided by this.frameColumns to find out which row of frames Luna's current frame belongs to.
             // Math.floor(...) ensures that the result is an integer (flooring any decimal part).
             // * this.frameHeight calculates the Y-coordinate by multiplying the row index by the height of each frame
             this.frameWidth, this.frameHeight, // These parameters specify the width and height of the frame to draw from the sprite sheet. It ensures that only one frame is drawn.
             this.x, this.y,
             this.width, this.height
         );
     }
 }


 export { Luna };