import {
  Component,
  Type,
  ɵComponentDef as ComponentDef,
  ɵNG_COMP_DEF as NG_COMP_DEF,
} from '@angular/core';

@Component({ template: '' })
export class Base {}

export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export const getCompDef = (clazz: Type<any>): ComponentDef<any> => (<any>clazz)[NG_COMP_DEF];

export const updateDeclaredInputs = (def: Mutable<ComponentDef<any>>) => {
  def.declaredInputs = new Proxy(
    {},
    {
      get: (target: {}, p: string) => p,
    },
  );
};
updateDeclaredInputs.ngInherit = true;
