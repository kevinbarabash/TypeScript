module TestAssignment {
    class Animal {}
    class Cat { purr() {} }
    
    // Nested objects
    type CatNode = { animal: Cat };
    type AnimalNode = { animal: Animal };
    
    const cat = new Cat;

    const animalNode3: AnimalNode = { animal: cat };
    // animalsNode7.animals.push("foo");
}
