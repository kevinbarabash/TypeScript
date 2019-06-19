module TestGenerics {
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
