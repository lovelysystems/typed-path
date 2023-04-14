type Primitive = string | number | undefined | null | boolean | symbol | bigint;
type IsTuple<T extends ReadonlyArray<any>> = number extends T["length"]
  ? false
  : true;
type TupleKey<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
type ArrayKey = number;

type PathFilterTypes = "primitive" | "object" | "all";
const FilterTypeAll = Symbol("FT");
type FilterTypeAll = typeof FilterTypeAll;

type GenericPathCreator<
  K extends string | number,
  V,
  PT extends PathFilterTypes,
  // only these types are allowed
  FT extends any = FilterTypeAll
> = V extends Primitive
  ? // V is a primitive
    PT extends "object"
    ? never // only objects are requested
    : V extends FT
    ? // matches the type
      `${K}`
    : FT extends FilterTypeAll
    ? `${K}`
    : never
  : // V is an object
  PT extends "primitive"
  ? `${K}.${GenericPath<V, PT, FT>}` // only primitives are requested
  : V extends FT
  ? `${K}`
  : FT extends FilterTypeAll
  ? `${K}` | `${K}.${GenericPath<V, PT, FT>}`
  : `${K}.${GenericPath<V, PT, FT>}`;

type GenericPath<T, PT extends PathFilterTypes, FT> = T extends ReadonlyArray<
  infer V
>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKey<T>]-?: GenericPathCreator<K & string, T[K], PT, FT>;
      }[TupleKey<T>]
    : GenericPathCreator<ArrayKey, V, PT, FT>
  : {
      [K in keyof T]-?: GenericPathCreator<K & string, T[K], PT, FT>;
    }[keyof T];

export type PathOfType<T, FT = FilterTypeAll> = GenericPath<T, "all", FT>;
export type ObjectPathOfType<T, FT = FilterTypeAll> = GenericPath<
  T,
  "object",
  FT
>;
export type PropertyPathOfType<T, FT = FilterTypeAll> = GenericPath<
  T,
  "primitive",
  FT
>;

export type TypeAtPath<
  T,
  P extends PathOfType<T> | undefined = undefined
> = T extends any
  ? P extends undefined
    ? T
    : P extends keyof T
    ? T[P] // direct key of T
    : P extends `${ArrayKey}`
    ? T extends ReadonlyArray<infer V>
      ? V
      : never
    : P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends PathOfType<T[K]>
        ? TypeAtPath<T[K], R>
        : never
      : K extends `${ArrayKey}`
      ? T extends ReadonlyArray<infer V>
        ? TypeAtPath<V, R & PathOfType<V>>
        : never
      : never
    : never
  : never;
