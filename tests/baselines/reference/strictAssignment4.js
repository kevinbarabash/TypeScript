//// [strictAssignment4.ts]
module StrictAssignment4 {
    class Animal {}
    class Cat { purr() {} }
    class Dog { bark() {} }
    
    const cats: Cat[] = [new Cat];
    
    function foo(animals: Cat[]): void
    function foo(animals: Animal[]): void {
    }
    foo(cats); // okay, because there's a safe overload
    foo([new Cat]); // okay, because there's a safe overload

    function oof(animals: Animal[]): void 
    function oof(animals: Cat[]): void {
    }
    // TODO: make it so this isn't an error
    oof(cats); // okay, because there's a safe overload
    oof([new Cat]); // okay, because there's a safe overload

    function bar(animals: Dog[]): void
    function bar(animals: Animal[]): void {
    }
    bar(cats); // error, there's no safe overload
    bar([new Cat]); // error, there's no safe overload
}


//// [strictAssignment4.js]
var StrictAssignment4;
(function (StrictAssignment4) {
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
    var cats = [new Cat];
    function foo(animals) {
    }
    foo(cats); // okay, because there's a safe overload
    foo([new Cat]); // okay, because there's a safe overload
    function oof(animals) {
    }
    // TODO: make it so this isn't an error
    oof(cats); // okay, because there's a safe overload
    oof([new Cat]); // okay, because there's a safe overload
    function bar(animals) {
    }
    bar(cats); // error, there's no safe overload
    bar([new Cat]); // error, there's no safe overload
})(StrictAssignment4 || (StrictAssignment4 = {}));
