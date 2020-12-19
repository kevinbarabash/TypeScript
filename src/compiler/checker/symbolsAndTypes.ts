/* @internal */
namespace ts {
    type GetUnionType = (types: readonly Type[], unionReduction?: UnionReduction, aliasSymbol?: Symbol, aliasTypeArguments?: readonly Type[]) => Type;

    interface SymbolsAndTypes {
        createSymbol(flags: SymbolFlags, name: __String, checkFlags?: CheckFlags): TransientSymbol;

        getSymbolCount(): number;

        globals: SymbolTable;

        undefinedSymbol: TransientSymbol;
        globalThisSymbol: TransientSymbol;
        argumentsSymbol: TransientSymbol;
        requireSymbol: TransientSymbol;

        createType(flags: TypeFlags): Type;
        createIntrinsicType(kind: TypeFlags, intrinsicName: string, objectFlags?: ObjectFlags): IntrinsicType;
        createBooleanType(trueFalseTypes: readonly Type[], getUnionType: GetUnionType): IntrinsicType & UnionType;
        createObjectType(objectFlags: ObjectFlags, symbol?: Symbol): ObjectType;
        createTypeofType(getUnionType: GetUnionType): Type;
        createTypeParameter(symbol?: Symbol): TypeParameter;
        createLiteralType(flags: TypeFlags, value: string | number | PseudoBigInt, symbol: Symbol | undefined): LiteralType;

        getLiteralType(value: string): StringLiteralType;
        getLiteralType(value: string | number | PseudoBigInt, enumId?: number, symbol?: Symbol): LiteralType;

        getTypeCatalog(): readonly Type[];
        getTypeCount(): number;
    }

    export function createSymbolsAndTypes(checker: TypeChecker, host: TypeCheckerHost): SymbolsAndTypes {
        const Symbol = objectAllocator.getSymbolConstructor();
        const Type = objectAllocator.getTypeConstructor();

        let symbolCount = 0;
        let typeCount = 0;

        const typeCatalog: Type[] = []; // NB: id is index + 1

        const literalTypes = new Map<string, LiteralType>();

        function createSymbol(flags: SymbolFlags, name: __String, checkFlags?: CheckFlags) {
            symbolCount++;
            const symbol = <TransientSymbol>(new Symbol(flags | SymbolFlags.Transient, name));
            symbol.checkFlags = checkFlags || 0;
            return symbol;
        }

        const globals = createSymbolTable();

        const undefinedSymbol = createSymbol(SymbolFlags.Property, "undefined" as __String);
        undefinedSymbol.declarations = [];

        const globalThisSymbol = createSymbol(SymbolFlags.Module, "globalThis" as __String, CheckFlags.Readonly);
        globalThisSymbol.exports = globals;
        globalThisSymbol.declarations = [];
        globals.set(globalThisSymbol.escapedName, globalThisSymbol);

        const argumentsSymbol = createSymbol(SymbolFlags.Property, "arguments" as __String);
        const requireSymbol = createSymbol(SymbolFlags.Property, "require" as __String);

        function createType(flags: TypeFlags): Type {
            const result = new Type(checker, flags);
            typeCount++;
            result.id = typeCount;
            typeCatalog.push(result);
            return result;
        }

        function createIntrinsicType(kind: TypeFlags, intrinsicName: string, objectFlags: ObjectFlags = 0): IntrinsicType {
            const type = <IntrinsicType>createType(kind);
            type.intrinsicName = intrinsicName;
            type.objectFlags = objectFlags;
            return type;
        }

        function createBooleanType(trueFalseTypes: readonly Type[], getUnionType: GetUnionType): IntrinsicType & UnionType {
            const type = <IntrinsicType & UnionType>getUnionType(trueFalseTypes);
            type.flags |= TypeFlags.Boolean;
            type.intrinsicName = "boolean";
            return type;
        }

        function createObjectType(objectFlags: ObjectFlags, symbol?: Symbol): ObjectType {
            const type = <ObjectType>createType(TypeFlags.Object);
            type.objectFlags = objectFlags;
            type.symbol = symbol!;
            type.members = undefined;
            type.properties = undefined;
            type.callSignatures = undefined;
            type.constructSignatures = undefined;
            type.stringIndexInfo = undefined;
            type.numberIndexInfo = undefined;
            return type;
        }

        function createTypeofType(getUnionType: GetUnionType) {
            return getUnionType(arrayFrom(typeofEQFacts.keys(), getLiteralType));
        }

        function createTypeParameter(symbol?: Symbol) {
            const type = <TypeParameter>createType(TypeFlags.TypeParameter);
            if (symbol) type.symbol = symbol;
            return type;
        }

        function createLiteralType(flags: TypeFlags, value: string | number | PseudoBigInt, symbol: Symbol | undefined) {
            const type = <LiteralType>createType(flags);
            type.symbol = symbol!;
            type.value = value;
            return type;
        }

        function getLiteralType(value: string): StringLiteralType;
        function getLiteralType(value: string | number | PseudoBigInt, enumId?: number, symbol?: Symbol): LiteralType;
        function getLiteralType(value: string | number | PseudoBigInt, enumId?: number, symbol?: Symbol) {
            // We store all literal types in a single map with keys of the form '#NNN' and '@SSS',
            // where NNN is the text representation of a numeric literal and SSS are the characters
            // of a string literal. For literal enum members we use 'EEE#NNN' and 'EEE@SSS', where
            // EEE is a unique id for the containing enum type.
            const qualifier = typeof value === "number" ? "#" : typeof value === "string" ? "@" : "n";
            const key = (enumId ? enumId : "") + qualifier + (typeof value === "object" ? pseudoBigIntToString(value) : value);
            let type = literalTypes.get(key);
            if (!type) {
                const flags = (typeof value === "number" ? TypeFlags.NumberLiteral :
                    typeof value === "string" ? TypeFlags.StringLiteral : TypeFlags.BigIntLiteral) |
                    (enumId ? TypeFlags.EnumLiteral : 0);
                literalTypes.set(key, type = createLiteralType(flags, value, symbol));
                type.regularType = type;
            }
            return type;
        }

        return {
            createSymbol,

            getSymbolCount: () => sum(host.getSourceFiles(), "symbolCount") + symbolCount,

            globals,

            undefinedSymbol,
            globalThisSymbol,
            argumentsSymbol,
            requireSymbol,

            createType,
            createIntrinsicType,
            createBooleanType,
            createObjectType,
            createTypeofType,
            createTypeParameter,
            createLiteralType,

            getLiteralType,

            getTypeCatalog: () => typeCatalog,
            getTypeCount: () => typeCount,
        };
    }
}
