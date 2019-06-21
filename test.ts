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
}
