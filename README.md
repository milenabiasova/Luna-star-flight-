# Luna-star-flight-
I want to start my game from the scratch since it seems to be the most logical solution, because i can undertsand my own code better.

Classes:

GameObject Class:

This is the base class for all game objects.
It initializes an object with its position (x, y), size (width, height), and image (imageSrc).
The draw method renders the object on the canvas.
The update method provides basic logic for moving the object, typically to the left, considering gameSpeed.
This class can be extended to create specific game objects like Luna, Stars, and Obstacles.
Luna Class:

Extends the GameObject class.
Represents the main character or an entity in your game.
The constructor initializes Luna with additional properties for animation (frameColumns, frameRows, etc.).
jump method: Allows Luna to jump (changes vertical velocity).
update method: Updates Luna's position and frame for animation. It also applies gravity to Luna's movement.
draw method: Renders Luna on the canvas with the current animation frame.
Stars Class:

Also extends the GameObject class.
Represents collectible items or stars in your game.
Inherits draw and update methods from GameObject, which can be overridden if necessary.
Has an additional property collected, which can be used to track if the star has been collected.
Obstacle Class:

Another extension of GameObject.
Represents obstacles in the game.
Inherits the basic functionalities of GameObject and can be customized further with additional methods or properties.
I am expecting following challenges:

- implementing a random appearance of stars and trees - i want to solve it with implementing 2 functions  addStar() and addObstacle(). They will randomly select an index from an array, which will contain data about trees and stars (their images and sizes). Then a new Obstacle and Star instances will be created using the selected tree or star image and their dimensions. Then a function maybe called isOcerlapping will check whether the obects overlap existing objects. If there is no overlapping, then a new obstacle(or star) is added to the obstacles(stars) array.

- applying inheritance to my code - i already started my project without using inheritance and i created separate classes for every game object. A problem can arise when trying to abstract and transfer common methods and properties into a base class, especially if these methods and properties are previously designed to be specific to each object. I will need to refactor my code and test it many times. 

- sound Effects

- collision in combination with the gravity

- time management

 

Challenges that i alredy solved:

Collision detection - i solved it with creating finctions isCollidingOwlTree and isCollidingWithStar. 

isCollidingOwlTree - This function checks for collision between the "owl" object and the "tree" object. It uses a rectangular collision detection algorithm, taking into account the X and Y coordinates, as well as the dimensions of both objects. An additional "buffer" is used for more realistic collision detection to prevent "kinematic" collisions where objects are not graphically touching each other but theirbounding boxes intersect.

isCollidingWithStar - This function similarly checks for collisions between "owl" and "star".
Unlike tree collision checking, there is no "buffer" used, making the checking more
rigorous and accurate to actual object boundaries

Both functions use the classic method of collision checking by comparing 
the positions and sizes of objects. If the conditions inside the functions are true, 
it means that a collision has occurred.
Reflection
Overall, enjoyed this project, most of the times I faced challenges that required my full focus and even more. I consider it to be a positive thing, because it helped me to recognize my strengths and weaknesses, which always helps me to grow.

The most enjoyable aspect for me was the creative process of designing and animating my own character. Seeing it come to life within the game was gratifying.

Despite my enthusiasm, one of the significant challenges I faced was managing my expectations. I realized that time constraints and my current skill level limited what I could achieve. This realization taught me the importance of setting realistic goals and pacing myself. Although I wasn't able to accomplish everything I initially wanted to do, I am satisfied with what I've achieved.

A notable area I found challenging was understanding and applying the concept of inheritance to my code. I underestimated it and and putting it into practice was more difficult than i expected.  

Another thing I want  to mention is that once I tried to upload the project to the campus cloud , I faced a final and an unexpected challenge. The game was working at first, but once i restarted it , it just froze, because apparently not all images had time to load. I had a hard time solving this problem, but initially It worked.

Working in our collaborative environment was another highlight of this project. It allowed me to observe and learn from the mistakes of others, offering a unique learning opportunity since most of us were on the same level and faced similar challenges. 

The next aspect that made me feel comfortable and optimistic about the end result was that we received great support from the professors and tutors.Their willingness to help and the positive approach made this experience even more rewarding.

In general, the project taught me to balance creativity with practicality, and to appreciate the process of learning from both success and failure and never underestimate problems that might occure in the future. Even though the project expirience showed that i have to work harder and be more focused,  I do realize that i grew during these 2 weeks.
