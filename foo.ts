class Animal {}
class Dog extends Animal { bark() {} }
class Cat extends Animal { purr() {} }

const cats: Cat[] = [];
const badCats: Cat[] = [];
const goodAnimals: Animal[] = [new Cat, new Dog];
const readonlyAnimals: ReadonlyArray<Animal> = cats;
const badAnimals: Animal[] = cats; // error

const foo = (animals: Animal[]) => {};
foo(goodAnimals);
foo([new Cat]);
foo(cats); // error

const bar = (animals: ReadonlyArray<Animal>) => {};
bar(goodAnimals);
bar(cats);
bar([new Cat]);

badAnimals.push(new Dog);
// Unsound and bad
cats.forEach(cat => cat.purr());
