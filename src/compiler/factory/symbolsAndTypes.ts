/* @internal */
namespace ts {
    interface SymbolsAndTypes {
        createSymbol(flags: SymbolFlags, name: __String, checkFlags?: CheckFlags): TransientSymbol;

        getSymbolCount(): number;

        globals: SymbolTable;

        undefinedSymbol: TransientSymbol;
        globalThisSymbol: TransientSymbol;
        argumentsSymbol: TransientSymbol;
        requireSymbol: TransientSymbol;

        createType(flags: TypeFlags): Type;

        getTypeCatalog(): readonly Type[];
        getTypeCount(): number;
    }

    export function createSymbolsAndTypes(checker: TypeChecker, host: TypeCheckerHost): SymbolsAndTypes {
        const Symbol = objectAllocator.getSymbolConstructor();
        const Type = objectAllocator.getTypeConstructor();

        let symbolCount = 0;
        let typeCount = 0;

        const typeCatalog: Type[] = []; // NB: id is index + 1

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

        return {
            createSymbol,

            getSymbolCount: () => sum(host.getSourceFiles(), "symbolCount") + symbolCount,

            globals,

            undefinedSymbol,
            globalThisSymbol,
            argumentsSymbol,
            requireSymbol,

            createType,

            getTypeCatalog: () => typeCatalog,
            getTypeCount: () => typeCount,
        };
    }
}
