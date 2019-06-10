class Animal {}
class Dog extends Animal { bark() {} }
class Cat extends Animal { purr() {} }

const cats: Cat[] = [new Cat];
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

type NumberNode = { id: number };
type MixedNode = { id: number | string };
const numNode: NumberNode = { id: 5 };
const goodMixedNode: MixedNode = { id: 5 };
const badMixedNode: MixedNode = numNode; // error
badMixedNode.id = "five"; // whoops, now node0 has a string for its "id"
const readonlyMixedNode: Readonly<MixedNode> = numNode; // this is okay

const mixedNodeFunc = (node: MixedNode) => {};
mixedNodeFunc(goodMixedNode);
mixedNodeFunc(numNode);
mixedNodeFunc({ id: 5 });

const readonlyMixedNodeFunc = (node: Readonly<MixedNode>) => {};
readonlyMixedNodeFunc(goodMixedNode);
readonlyMixedNodeFunc(numNode);
readonlyMixedNodeFunc({ id: 5 });
