import {GameObject} from "./game object.js";

class Obstacle extends GameObject {
    constructor(x, y, width, height, imageSrc) {//calls the constructor of the superclass
        super(x, y, width, height, imageSrc);
    }
}


export {Obstacle}