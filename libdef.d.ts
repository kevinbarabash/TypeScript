// @strict-assignment

declare class Animal {}
declare class Cat { purr(): void }
declare class Dog { bark(): void }

declare function foo(animals: Animal[]): void;

type CatNode = { animal: Cat };
type AnimalNode = { animal: Animal };
type ReadonlyAnimalNode = { animal: Readonly<Animal> };

type CatsNode = { animals: Cat[] };
type AnimalsNode = { animals: Animal[] };
type ReadonlyAnimalsNode = { animals: ReadonlyArray<Animal> };
