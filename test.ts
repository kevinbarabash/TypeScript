module TestAssignment {
    type Node = { id: number | string };
    type NumNode = { id: number};

    const numNode: NumNode = { id: 5 };
    const node: Node = numNode; // error, prevent setting id to a string
    node.id = "five";

    const readonlyNode: Readonly<Node> = numNode;
    readonlyNode.id = "five"; // error, readonlyNode is readonly
}
