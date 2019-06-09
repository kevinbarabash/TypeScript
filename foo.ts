class Animal {}
class Dog extends Animal { bark() {} }
class Cat extends Animal { purr() {} }

const cats: Array<Cat> = [new Cat];
const badCats: Array<Cat> = [];
const goodAnimals: Array<Animal> = [new Cat, new Dog];
const readonlyAnimals: ReadonlyArray<Animal> = cats;
const badAnimals: Array<Animal> = cats; // error

badAnimals.push(new Dog);
// Unsound and bad
cats.forEach(cat => cat.purr());
