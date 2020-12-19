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
        createObjectType(objectFlags: ObjectFlags, symbol?: Symbol): ObjectType;
        createTypeofType(): Type;
        createTypeParameter(symbol?: Symbol): TypeParameter;
        createLiteralType(flags: TypeFlags, value: string | number | PseudoBigInt, symbol: Symbol | undefined): LiteralType;

        getLiteralType(value: string): StringLiteralType;
        getLiteralType(value: string | number | PseudoBigInt, enumId?: number, symbol?: Symbol): LiteralType;

        getTypeCatalog(): readonly Type[];
        getTypeCount(): number;

        anyType: IntrinsicType;
        autoType: IntrinsicType;
        wildcardType: IntrinsicType;
        errorType: IntrinsicType;
        nonInferrableAnyType: IntrinsicType;
        intrinsicMarkerType: IntrinsicType;
        unknownType: IntrinsicType;
        undefinedType: IntrinsicType;
        undefinedWideningType: IntrinsicType;
        optionalType: IntrinsicType;
        nullType: IntrinsicType;
        nullWideningType: IntrinsicType;
        stringType: IntrinsicType;
        numberType: IntrinsicType;
        bigintType: IntrinsicType;
        falseType: IntrinsicType;
        regularFalseType: IntrinsicType;
        trueType: IntrinsicType;
        regularTrueType: IntrinsicType;
        booleanType: IntrinsicType & UnionType;
        esSymbolType: IntrinsicType;
        voidType: IntrinsicType;
        neverType: IntrinsicType;
        silentNeverType: IntrinsicType;
        nonInferrableType: IntrinsicType;
        implicitNeverType: IntrinsicType;
        unreachableNeverType: IntrinsicType;
        nonPrimitiveType: IntrinsicType;
        stringNumberSymbolType: Type;
        keyofConstraintType: Type;
        numberOrBigIntType: Type;
        templateConstraintType: UnionType;
    }

    export function createSymbolsAndTypes(checker: TypeChecker, host: TypeCheckerHost, getUnionType: GetUnionType): SymbolsAndTypes {
        const compilerOptions = host.getCompilerOptions();

        const strictNullChecks = getStrictOptionValue(compilerOptions, "strictNullChecks");
        const keyofStringsOnly = !!compilerOptions.keyofStringsOnly;

        const Symbol = objectAllocator.getSymbolConstructor();
        const Type = objectAllocator.getTypeConstructor();

        let symbolCount = 0;
        let typeCount = 0;

        const typeCatalog: Type[] = []; // NB: id is index + 1

        const literalTypes = new Map<string, LiteralType>();

        const anyType = createIntrinsicType(TypeFlags.Any, "any");
        const autoType = createIntrinsicType(TypeFlags.Any, "any");
        const wildcardType = createIntrinsicType(TypeFlags.Any, "any");
        const errorType = createIntrinsicType(TypeFlags.Any, "error");
        const nonInferrableAnyType = createIntrinsicType(TypeFlags.Any, "any", ObjectFlags.ContainsWideningType);
        const intrinsicMarkerType = createIntrinsicType(TypeFlags.Any, "intrinsic");
        const unknownType = createIntrinsicType(TypeFlags.Unknown, "unknown");
        const undefinedType = createIntrinsicType(TypeFlags.Undefined, "undefined");
        const undefinedWideningType = strictNullChecks ? undefinedType : createIntrinsicType(TypeFlags.Undefined, "undefined", ObjectFlags.ContainsWideningType);
        const optionalType = createIntrinsicType(TypeFlags.Undefined, "undefined");
        const nullType = createIntrinsicType(TypeFlags.Null, "null");
        const nullWideningType = strictNullChecks ? nullType : createIntrinsicType(TypeFlags.Null, "null", ObjectFlags.ContainsWideningType);
        const stringType = createIntrinsicType(TypeFlags.String, "string");
        const numberType = createIntrinsicType(TypeFlags.Number, "number");
        const bigintType = createIntrinsicType(TypeFlags.BigInt, "bigint");
        const falseType = createIntrinsicType(TypeFlags.BooleanLiteral, "false") as FreshableIntrinsicType;
        const regularFalseType = createIntrinsicType(TypeFlags.BooleanLiteral, "false") as FreshableIntrinsicType;
        const trueType = createIntrinsicType(TypeFlags.BooleanLiteral, "true") as FreshableIntrinsicType;
        const regularTrueType = createIntrinsicType(TypeFlags.BooleanLiteral, "true") as FreshableIntrinsicType;
        trueType.regularType = regularTrueType;
        trueType.freshType = trueType;
        regularTrueType.regularType = regularTrueType;
        regularTrueType.freshType = trueType;
        falseType.regularType = regularFalseType;
        falseType.freshType = falseType;
        regularFalseType.regularType = regularFalseType;
        regularFalseType.freshType = falseType;
        const booleanType = createBooleanType([regularFalseType, regularTrueType]);
        // Also mark all combinations of fresh/regular booleans as "Boolean" so they print as `boolean` instead of `true | false`
        // (The union is cached, so simply doing the marking here is sufficient)
        createBooleanType([regularFalseType, trueType]);
        createBooleanType([falseType, regularTrueType]);
        createBooleanType([falseType, trueType]);
        const esSymbolType = createIntrinsicType(TypeFlags.ESSymbol, "symbol");
        const voidType = createIntrinsicType(TypeFlags.Void, "void");
        const neverType = createIntrinsicType(TypeFlags.Never, "never");
        const silentNeverType = createIntrinsicType(TypeFlags.Never, "never");
        const nonInferrableType = createIntrinsicType(TypeFlags.Never, "never", ObjectFlags.NonInferrableType);
        const implicitNeverType = createIntrinsicType(TypeFlags.Never, "never");
        const unreachableNeverType = createIntrinsicType(TypeFlags.Never, "never");
        const nonPrimitiveType = createIntrinsicType(TypeFlags.NonPrimitive, "object");
        const stringNumberSymbolType = getUnionType([stringType, numberType, esSymbolType]);
        const keyofConstraintType = keyofStringsOnly ? stringType : stringNumberSymbolType;
        const numberOrBigIntType = getUnionType([numberType, bigintType]);
        const templateConstraintType = getUnionType([stringType, numberType, booleanType, bigintType, nullType, undefinedType]) as UnionType;

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

        function createBooleanType(trueFalseTypes: readonly Type[]): IntrinsicType & UnionType {
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

        function createTypeofType() {
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
            createObjectType,
            createTypeofType,
            createTypeParameter,
            createLiteralType,

            getLiteralType,

            getTypeCatalog: () => typeCatalog,
            getTypeCount: () => typeCount,

            anyType,
            autoType,
            wildcardType,
            errorType,
            nonInferrableAnyType,
            intrinsicMarkerType,
            unknownType,
            undefinedType,
            undefinedWideningType,
            optionalType,
            nullType,
            nullWideningType,
            stringType,
            numberType,
            bigintType,
            falseType,
            regularFalseType,
            trueType,
            regularTrueType,
            booleanType,
            esSymbolType,
            voidType,
            neverType,
            silentNeverType,
            nonInferrableType,
            implicitNeverType,
            unreachableNeverType,
            nonPrimitiveType,
            stringNumberSymbolType,
            keyofConstraintType,
            numberOrBigIntType,
            templateConstraintType,
        };
    }
}
