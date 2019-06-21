//// [strictAssignment1.ts]
module StrictAssignment1 {
    class Animal {}
    class Cat { purr() {} }
    class Dog { bark() {} }
    
    // Arrays
    const cats: Cat[] = [new Cat];
    
    // TODO: write tests that show the order of the next two statements don't matter
    const animals1: Animal[] = cats; // error: alias assignments are invariant
    const animals2: Animal[] = [new Cat];  // okay: covariant is safe since source is a literal
    const animals3: ReadonlyArray<Animal> = cats; // okay: covariant is safe since target is readonly
    
    // TODO: check assignments as well as variable declarations
    
    // // Simple Objects
    type CatNode = { animal: Cat };
    type AnimalNode = { animal: Animal };
    type ReadonlyAnimalNode = { animal: Readonly<Animal> };
    
    const catNode: CatNode = { animal: new Cat };
    const cat = new Cat;
    
    const animalNode1: AnimalNode = catNode; // error
    const animalNode2: AnimalNode = { animal: new Cat }; // okay
    const animalNode3: AnimalNode = { animal: cat }; // okay
    const animalNode4: Readonly<AnimalNode> = catNode; // okay
    
    // Need to check if the target is readonly
    const animalNode5: ReadonlyAnimalNode = { animal: cat }; // okay
    
    // Nested objects
    type CatsNode = { animals: Cat[] };
    type AnimalsNode = { animals: Animal[] };
    type ReadonlyAnimalsNode = { animals: ReadonlyArray<Animal> };
    
    const catsNode: CatsNode = { animals: [new Cat] };
    // const cats: Cat[] = [new Cat];
    
    const animalsNode1: AnimalsNode = catsNode; // error
    // prevents animalsNode.animals = [new Dog] which would conflict 
    // with CatsNode's definition of its animals property
    
    const animalsNode2: AnimalsNode = { animals: [new Cat] }; // okay
    // okay since we're not storing [new Cat] in a variable typed as a Cat[]
    
    const animalsNode3: AnimalsNode = { animals: cats }; // error
    // prevents animalsNode.animals.push(new Dog) which would add
    // a Dog to cats array
    
    const animalsNode4: ReadonlyAnimalsNode = { animals: cats }; // okay
    // okay since the animals property is a readonly array and we are unable
    // to add new elements to it.
    
    const animalsNode5: ReadonlyAnimalsNode = catsNode; // error
    // prevents animalsNode.animals = [new Dog] which would conflict 
    // with CatsNode's definition of its animals property
    
    const animalsNode6: Readonly<ReadonlyAnimalsNode> = catsNode; // okay
    // prevents both setting animals property to different from Cats[] and
    // prevents adding a Dog to the animals array which is typed as a Cats[]
    // on the right side
    
    const animalsNode7: Readonly<AnimalsNode> = catsNode;  // error
    // while making AnimalsNode readonly prevents the reassignment of animals
    // to something other than Cat[], it's still possible to push a Dog to catsNode's
    // animals array.
    
    const animalsNode8: Readonly<AnimalsNode> = { animals: cats }; // error
    
    const animalsNode9: Readonly<ReadonlyAnimalsNode> = { animals: cats };
}


//// [strictAssignment1.js]
var StrictAssignment1;
(function (StrictAssignment1) {
    var Animal = /** @class */ (function () {
        function Animal() {
        }
        return Animal;
    }());
    var Cat = /** @class */ (function () {
        function Cat() {
        }
        Cat.prototype.purr = function () { };
        return Cat;
    }());
    var Dog = /** @class */ (function () {
        function Dog() {
        }
        Dog.prototype.bark = function () { };
        return Dog;
    }());
    // Arrays
    var cats = [new Cat];
    // TODO: write tests that show the order of the next two statements don't matter
    var animals1 = cats; // error: alias assignments are invariant
    var animals2 = [new Cat]; // okay: covariant is safe since source is a literal
    var animals3 = cats; // okay: covariant is safe since target is readonly
    var catNode = { animal: new Cat };
    var cat = new Cat;
    var animalNode1 = catNode; // error
    var animalNode2 = { animal: new Cat }; // okay
    var animalNode3 = { animal: cat }; // okay
    var animalNode4 = catNode; // okay
    // Need to check if the target is readonly
    var animalNode5 = { animal: cat }; // okay
    var catsNode = { animals: [new Cat] };
    // const cats: Cat[] = [new Cat];
    var animalsNode1 = catsNode; // error
    // prevents animalsNode.animals = [new Dog] which would conflict 
    // with CatsNode's definition of its animals property
    var animalsNode2 = { animals: [new Cat] }; // okay
    // okay since we're not storing [new Cat] in a variable typed as a Cat[]
    var animalsNode3 = { animals: cats }; // error
    // prevents animalsNode.animals.push(new Dog) which would add
    // a Dog to cats array
    var animalsNode4 = { animals: cats }; // okay
    // okay since the animals property is a readonly array and we are unable
    // to add new elements to it.
    var animalsNode5 = catsNode; // error
    // prevents animalsNode.animals = [new Dog] which would conflict 
    // with CatsNode's definition of its animals property
    var animalsNode6 = catsNode; // okay
    // prevents both setting animals property to different from Cats[] and
    // prevents adding a Dog to the animals array which is typed as a Cats[]
    // on the right side
    var animalsNode7 = catsNode; // error
    // while making AnimalsNode readonly prevents the reassignment of animals
    // to something other than Cat[], it's still possible to push a Dog to catsNode's
    // animals array.
    var animalsNode8 = { animals: cats }; // error
    var animalsNode9 = { animals: cats };
})(StrictAssignment1 || (StrictAssignment1 = {}));
