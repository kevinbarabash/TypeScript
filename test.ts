/// <reference path="./libdef.d.ts" />

module TestAssignment {
    type Node = { id: number | string };
    type NumNode = { id: number};

    const numNode: NumNode = { id: 5 };
    const node1: Node = numNode; // error, prevent setting id to a string
    node1.id = "five";

    const node2: Node = { id: 5 }; // okay, since the source is an object literal
    node2.id = "five";

    const readonlyNode: Readonly<Node> = numNode;
    readonlyNode.id = "five"; // error, readonlyNode is readonly

    const cats: Cat[] = [new Cat];
    
    foo(cats); // error, prevent a Dog from getting added to cats
    foo([new Cat]);  // okay

    const catNode: CatNode = { animal: new Cat };
    const cat = new Cat;
    
    const animalNode1: AnimalNode = catNode; // error
    const animalNode2: AnimalNode = { animal: new Cat }; // okay
    const animalNode3: AnimalNode = { animal: cat }; // okay
    const animalNode4: Readonly<AnimalNode> = catNode; // okay
}
