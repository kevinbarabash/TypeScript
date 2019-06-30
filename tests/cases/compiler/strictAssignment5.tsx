// @jsx: react
// @esModuleInterop: true
// @strictAssignment: true
/// <reference path="/.lib/react16.d.ts" />
import React from "react";

module StrictAssignment5 {
    class Animal {}
    class Cat { purr() {} }
    class Dog { bark() {} }

    type Props = {
        animals: Animal[],
    };

    class Foo extends React.Component<Props> {
        render() {
            return "foo";
        }
    }

    const cats: Cat[] = [new Cat];
    <Foo animals={cats} />; // error
    <Foo animals={[new Cat]} />; // okay
    
    type ReadonlyProps = {
        animals: ReadonlyArray<Animal>,
    };

    class Bar extends React.Component<ReadonlyProps> {
        render() {
            return "foo";
        }
    }

    <Bar animals={cats} />; // okay
}
