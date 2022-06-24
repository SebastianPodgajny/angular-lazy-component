import {
  ChangeDetectorRef,
  ComponentRef,
  EventEmitter,
  inject,
  SimpleChanges,
  Type,
  ViewContainerRef,
  ɵNG_COMP_DEF as NG_COMP_DEF,
  ɵComponentDef as ComponentDef,
} from '@angular/core';
import { Base, getCompDef, updateDeclaredInputs } from './utils';

export function asLazy<T>(cmp: () => Promise<T>): T {
  let clazz = <any>class {
    private changes!: SimpleChanges;
    private cmpRef!: ComponentRef<any>;
    private setInput!: (instance: any, key: string, value: any) => void;

    constructor() {
      const viewRef = inject(ChangeDetectorRef);
      const viewContainerRef = inject(ViewContainerRef);
      const tNode = (<any>viewRef)._lView[6];

      tNode.inputs = new Proxy(
        {},
        {
          get: (target: {}, p: string) => [tNode.directiveStart, p],
        },
      );
      tNode.outputs = new Proxy(
        {},
        {
          get: (target: {}, p: string) => {
            (<any>this)[p] = new EventEmitter();
            return [tNode.directiveStart, p];
          },
        },
      );

      setTimeout(async () => {
        const component: Type<T> = <any>await cmp();
        this.createLazyLoaded(component, viewContainerRef);
      });
    }

    private createLazyLoaded(cmp: Type<T>, vcr: ViewContainerRef) {
      const componentDef = getCompDef(cmp);
      this.cmpRef = vcr.createComponent(cmp);

      this.watchOutputs(componentDef);
      this.setInput = componentDef.setInput
        ? (instance, key, value) => componentDef.setInput!(instance, value, key, key)
        : (instance, key, value) => (instance[key] = value);
      this.updateComponent();
    }

    public ngOnChanges(changes: SimpleChanges) {
      this.changes = changes;
      this.updateComponent();
    }

    private updateComponent() {
      if (!this.cmpRef) return;

      Object.keys(this.changes).forEach(key =>
        this.setInput(this.cmpRef.instance, key, this.changes[key].currentValue),
      );
    }

    private watchOutputs(componentDef: ComponentDef<any>) {
      Object.keys(componentDef.outputs).forEach(key => {
        const _this = <Record<string, EventEmitter<any>>>(<unknown>this);
        if (!_this[key]) {
          _this[key] = new EventEmitter();
        }
        this.cmpRef.instance[key].subscribe((value: any) => _this[key].emit(value));
      });
    }
  };

  const baseCompDef = getCompDef(Base);
  clazz[NG_COMP_DEF] = baseCompDef;
  clazz[NG_COMP_DEF].features = [updateDeclaredInputs];

  return <T>clazz;
}
