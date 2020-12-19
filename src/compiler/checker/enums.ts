/* internal */
namespace ts {
    export const enum TypeSystemPropertyName {
        Type,
        ResolvedBaseConstructorType,
        DeclaredType,
        ResolvedReturnType,
        ImmediateBaseConstraint,
        EnumTagType,
        ResolvedTypeArguments,
        ResolvedBaseTypes,
    }

    export const enum CheckMode {
        Normal = 0,                     // Normal type checking
        Contextual = 1 << 0,            // Explicitly assigned contextual type, therefore not cacheable
        Inferential = 1 << 1,           // Inferential typing
        SkipContextSensitive = 1 << 2,  // Skip context sensitive function expressions
        SkipGenericFunctions = 1 << 3,  // Skip single signature generic functions
        IsForSignatureHelp = 1 << 4,    // Call resolution for purposes of signature help
    }

    export const enum AccessFlags {
        None = 0,
        NoIndexSignatures = 1 << 0,
        Writing = 1 << 1,
        CacheSymbol = 1 << 2,
        NoTupleBoundsCheck = 1 << 3,
        ExpressionPosition = 1 << 4,
    }

    export const enum SignatureCheckMode {
        BivariantCallback = 1 << 0,
        StrictCallback    = 1 << 1,
        IgnoreReturnTypes = 1 << 2,
        StrictArity       = 1 << 3,
        Callback          = BivariantCallback | StrictCallback,
    }

    export const enum IntersectionState {
        None = 0,
        Source = 1 << 0,
        Target = 1 << 1,
        PropertyCheck = 1 << 2,
        InPropertyCheck = 1 << 3,
    }

    export const enum MappedTypeModifiers {
        IncludeReadonly = 1 << 0,
        ExcludeReadonly = 1 << 1,
        IncludeOptional = 1 << 2,
        ExcludeOptional = 1 << 3,
    }

    export const enum ExpandingFlags {
        None = 0,
        Source = 1,
        Target = 1 << 1,
        Both = Source | Target,
    }

    export const enum MembersOrExportsResolutionKind {
        resolvedExports = "resolvedExports",
        resolvedMembers = "resolvedMembers"
    }

    export const enum UnusedKind {
        Local,
        Parameter,
    }
}
