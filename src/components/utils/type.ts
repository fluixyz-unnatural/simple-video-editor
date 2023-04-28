export type Branded<T, S extends string> = T & { [key in S]: never };
