//// [strictAssignment5.tsx]
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


//// [strictAssignment5.js]
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/// <reference path="react16.d.ts" />
var react_1 = __importDefault(require("react"));
var StrictAssignment5;
(function (StrictAssignment5) {
    var Animal = /** @class */ (function () {
        function Animal() {
        }
        return Animal;
    }());
    var Cat = /** @class */ (function () {
        function Cat() {
        }
        Cat.prototype.purr = function () { };
        return Cat;
    }());
    var Dog = /** @class */ (function () {
        function Dog() {
        }
        Dog.prototype.bark = function () { };
        return Dog;
    }());
    var Foo = /** @class */ (function (_super) {
        __extends(Foo, _super);
        function Foo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Foo.prototype.render = function () {
            return "foo";
        };
        return Foo;
    }(react_1["default"].Component));
    var cats = [new Cat];
    react_1["default"].createElement(Foo, { animals: cats }); // error
    react_1["default"].createElement(Foo, { animals: [new Cat] }); // okay
    var Bar = /** @class */ (function (_super) {
        __extends(Bar, _super);
        function Bar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Bar.prototype.render = function () {
            return "foo";
        };
        return Bar;
    }(react_1["default"].Component));
    react_1["default"].createElement(Bar, { animals: cats }); // okay
})(StrictAssignment5 || (StrictAssignment5 = {}));
