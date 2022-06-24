import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'some-cmp',
  template: `
    <h2>Lazy works</h2>
    <h3>INPUT: {{ testInput }}</h3>

    <button mat-button [matMenuTriggerFor]="menu">Menu</button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>Item 1</button>
      <button mat-menu-item>Item 2</button>
    </mat-menu>

    <mat-form-field appearance="fill">
      <mat-label>Choose a date</mat-label>
      <input matInput [matDatepicker]="picker" />
      <mat-hint>MM/DD/YYYY</mat-hint>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  styles: [
    `@import '@angular/material/prebuilt-themes/deeppurple-amber.css';`,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class LazyComponent implements OnInit {
  @Input() testInput: string | number = '';

  @Output() testOutput = new EventEmitter();

  private counter = 0;

  public ngOnInit() {
    this.testOutput.emit(this.counter++);
    setInterval(() => this.testOutput.emit(this.counter++), 2000);
  }
}
