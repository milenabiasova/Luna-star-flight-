import {gameSpeed} from "../script.js";

class GameObject {
    // Constructor for the GameObject class
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
    }
  // Method to draw the object on the canvas
    draw(canvasContext) {
        canvasContext.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // Method to update the object's state
    update() {
        // Basic update logic
        this.x -= window.innerWidth * 0.0097 * gameSpeed;
    }
}
export { GameObject };