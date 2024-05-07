import {GameObject} from "./game object.js";
class Stars extends GameObject {
    constructor(x, y, width, height, imageSrc) {
        super(x, y, width, height, imageSrc);// calls the constructor of the superclass
        this.collected = false;
    }

    // The draw and update methods are inherited from GameObject.
}

export {Stars};