import { describe, expectTypeOf, it } from "vitest";

import type {
  ObjectPathOfType,
  PathOfType,
  PropertyPathOfType,
  TypeAtPath,
} from "../lib/typed-path";

describe("path type", () => {
  type TestStruct = {
    a: number;
    test: {
      data: string;
      nested: {
        value: string;
      };
    };
    arr: string[];
    arr1: { a1: string }[];
    tuple: [{ t: string }, number];
    f1: () => void;
  };

  it("should  handle simple structures", () => {
    type T = { a: number };
    expectTypeOf<PathOfType<T>>().toMatchTypeOf<"a">();
  });

  it("should provide all field path", () => {
    expectTypeOf<PathOfType<TestStruct>>().toMatchTypeOf<
      | "test"
      | "test.nested"
      | "a"
      | "test.data"
      | "test.nested.value"
      | "arr"
      | `arr.${number}`
      | "arr1"
      | `arr1.${number}`
      | `arr1.${number}.a1`
      | "tuple"
      | `tuple.0`
      | "tuple.0.t"
      | `tuple.1`
      | "f1"
    >();
  });

  it("should provide all property path", () => {
    expectTypeOf<PropertyPathOfType<TestStruct>>().toMatchTypeOf<
      | "a"
      | "test.data"
      | "test.nested.value"
      | `arr.${number}`
      | `arr1.${number}.a1`
      | "tuple.0.t"
      | `tuple.1`
    >();
  });

  it("should provide path of an array", () => {
    expectTypeOf<PathOfType<TestStruct["arr"]>>().toMatchTypeOf<`${number}`>();
    expectTypeOf<PathOfType<TestStruct["arr1"]>>().toMatchTypeOf<
      `${number}` | `${number}.a1`
    >();
  });

  it("should provide all object path", () => {
    expectTypeOf<ObjectPathOfType<TestStruct>>().toMatchTypeOf<
      | "test"
      | "test.nested"
      | "arr"
      | "arr1"
      | `arr1.${number}`
      | "tuple"
      | "tuple.0"
      | "f1"
    >();
  });

  it("should provide type from path", () => {
    expectTypeOf<TypeAtPath<TestStruct, "a">>().toMatchTypeOf<number>();

    expectTypeOf<TypeAtPath<TestStruct, "test.data">>().toMatchTypeOf<
      TestStruct["test"]["data"]
    >();

    expectTypeOf<TypeAtPath<TestStruct, "test.nested">>().toMatchTypeOf<
      TestStruct["test"]["nested"]
    >();

    expectTypeOf<TypeAtPath<TestStruct, "arr">>().toMatchTypeOf<
      TestStruct["arr"]
    >();
    expectTypeOf<TypeAtPath<TestStruct, "arr.0">>().toMatchTypeOf<string>();

    expectTypeOf<TypeAtPath<TestStruct, "arr1.0">>().toMatchTypeOf<{
      a1: string;
    }>();
    expectTypeOf<TypeAtPath<TestStruct, "arr1.0.a1">>().toMatchTypeOf<string>();
  });

  it("should provide path for specific types", () => {
    type TestStruct1 = {
      n: number;
    };
    type TestStruct2 = {
      s: string;
      ts1: TestStruct1;
      ts2: {
        n: number;
      };
      ts3: {
        s: string;
      };
    };
    expectTypeOf<PathOfType<TestStruct2, string>>().toMatchTypeOf<
      "s" | "ts3.s"
    >();
    expectTypeOf<PathOfType<TestStruct2, number>>().toMatchTypeOf<
      "ts1.n" | "ts2.n"
    >();
    expectTypeOf<PathOfType<TestStruct2, TestStruct1>>().toMatchTypeOf<
      "ts1" | "ts2"
    >();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expectTypeOf<PathOfType<TestStruct2, object>>().toMatchTypeOf<
      "ts1" | "ts2" | "ts3"
    >();
  });
});
