import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { asLazy } from './as-lazy/as-lazy';

export function ImportLazyComponent() {
  return import('./lazy.component').then(m => m.LazyComponent);
}

@Component({
  selector: 'lazy-some-cmp',
  template: '',
  standalone: true,
})
export class LazyDir extends asLazy(ImportLazyComponent) {}

@Component({
  selector: 'app-root',
  template: `
    <div>App root</div>
    <lazy-some-cmp [testInput]="value" (testOutput)='onOutput($event)'></lazy-some-cmp>
  `,
  standalone: true,
  imports: [LazyDir],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  value = 1;

  constructor() {
    setInterval(() => this.value++, 1000);
  }

  public onOutput(event: any) {
    console.log({ event })
  }
}
