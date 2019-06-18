module Test {
    class Animal {}
    class Cat { purr() {} }
    class Dog { bark() {} }

    const cats: Cat[] = [new Cat];

    // function foo(animals: Animal[]) {
    //     animals.push(new Dog);
    // }
    // foo(cats); // error, prevent a Dog from getting added to cats
    // foo([new Cat]);  // okay

    // function readonlyFoo(animals: ReadonlyArray<Animal>) {
    //     // can't mutate animals
    // }
    // readonlyFoo(cats); // okay since readonlyFoo can't mutate animals param

    // type CatNode = { animal: Cat };
    // type AnimalNode = { animal: Animal };

    // const catNode: CatNode = { animal: new Cat };

    // function bar(node: AnimalNode) {
    //     node.animal = new Dog;
    // }
    // bar(catNode); // error, prevent catNode.animal from becoming a Dog
    // bar({ animal: new Cat }); // okay, no other references to the new Cat

    // function readonlyBar(node: Readonly<AnimalNode>) {
    //     // can't mutate node and change the animal property
    // }
    // readonlyBar(catNode); // okay since readonlyBar can't mutate node param



    type CatsNode = { animals: Cat[] };
    type AnimalsNode = { animals: Animal[] };
    type ReadonlyAnimalsNode = { animals: ReadonlyArray<Animal> };
    
    // const catsNode: CatsNode = { animals: [new Cat] };
    const catsNode: CatsNode = { animals: cats };

    // function baz(node: AnimalsNode) {
    //     node.animals = [new Dog];
    //     node.animals.push(new Dog);
    //  }
     
    // baz(catsNode); // error
    // // prevents both replacing catNode.animals with a new array containing 
    // // a Dog or adding a Dog to the animals property
    
    // baz({ animals: cats }); // error
    // // prevent adding a dog to the animals property
    
    // baz({ animals: [new Cat] }); // okay, no other references to the array of Cats
     
    function readonlyBaz(node: Readonly<AnimalsNode>) {
        // can't set node.animals to a new array
        node.animals.push(new Dog);
    }
    // TODO: make this an error
    readonlyBaz(catsNode); // error, prevent adding a Dog to catsNode.animals
    // readonlyBaz({ animals: cats }); // error, prevent adding a dot to cats
    // readonlyBaz({ animals: [new Cat] }); // okay
}
