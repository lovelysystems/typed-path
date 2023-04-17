# Path Type

Provides type definitions which can create types to validate string path
against any type.

## Installation

```bash
npm install @lovelysystems/typed-path-names
```

```bash
pnpm add @lovelysystems/typed-path-names
```

```bash
yarn add @lovelysystems/typed-path-names
```

## Example

```typescript
import { PathOfType, PropertyPathOfType } from "lovely-typed-path-names";
type MyType = {
  value: string;
  child: {
    value: number;
  };
};

type names = PathOfType<MyType>;
// names = "value" | "child" | "child.value"

type properties = PropertyPathOfType<MyType>;
// properties = "value" | "child.value"

type stringProperties = PropertyPathOfType<MyType, string>;
// stringProperties = "value"
```

More examples can be found in the [tests](tests).

## Develop

This is a pnpm project!

```bash
pnpm install
```

Run tests:

```bash
pnpm test
```

### Build

There is no build run needed. The package just exports types.
