//// [strictAssignment3.ts]
module StrictAssignment3 {
    class Stack<T> {
        items: T[];
    
        push(item: T) {
            this.items.push(item);
        }
    }
    
    class Animal {}
    class Cat { purr() {} }
    class Dog { bark() {} }
    
    type AnimalNode = { stack: Stack<Animal> };
    type CatNode = { stack: Stack<Cat> };
    
    const catStack = new Stack<Cat>();
    catStack.push(new Cat);
    
    // The problem here is that the items property needs to be invariant
    // for this assignment to be safe and it isn't
    const animalNode: AnimalNode = { stack: catStack };
    animalNode.stack.push(new Dog);    
}


//// [strictAssignment3.js]
var StrictAssignment3;
(function (StrictAssignment3) {
    var Stack = /** @class */ (function () {
        function Stack() {
        }
        Stack.prototype.push = function (item) {
            this.items.push(item);
        };
        return Stack;
    }());
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
    var catStack = new Stack();
    catStack.push(new Cat);
    // The problem here is that the items property needs to be invariant
    // for this assignment to be safe and it isn't
    var animalNode = { stack: catStack };
    animalNode.stack.push(new Dog);
})(StrictAssignment3 || (StrictAssignment3 = {}));
