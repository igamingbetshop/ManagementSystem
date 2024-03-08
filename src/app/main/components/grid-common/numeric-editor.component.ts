import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICellEditorParams } from 'ag-grid-community';

const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';
const KEY_F2 = 'F2';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

@Component({
  selector: 'app-numeric-editor-cell',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  template: `
    <input
      #input
      type="number"
      (keydown)="onKeyDown($event)"
      [(ngModel)]="value"
    />
  `,
  styles: ['input { width: 40%; padding: 5px 10px; outline: none; }'],
})
export class NumericEditorComponent implements AfterViewInit {
  private params: ICellEditorParams;
  public value: number | null;
  public highlightAllOnFocus = true;
  private cancelBeforeStart = false;

  @ViewChild('input', { static: true }) public input: ElementRef;

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.setInitialState(this.params);
  }

  setInitialState(params: ICellEditorParams): void {
    let startValue: number | null = null;
    let highlightAllOnFocus = true;
    if (
      (params as any).keyPress === KEY_BACKSPACE ||
      (params as any).keyPress === KEY_DELETE ||
      !params.value
    ) {
      // If backspace or delete is pressed, clear the cell
      startValue = null;
    } else if (params.value) {
      // If a letter was pressed, start with the letter
      startValue = parseFloat(params.value);
      highlightAllOnFocus = false;
    } else {
      // Otherwise, start with the current value
      startValue = parseFloat(params.value);
      if ((params as any).keyPress === KEY_F2) {
        highlightAllOnFocus = false;
      }
    }
    this.value = startValue;
    this.highlightAllOnFocus = highlightAllOnFocus;
  }

  getValue(): any {
    return this.value;
  }

  isCancelBeforeStart(): boolean {
    return this.cancelBeforeStart;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.deleteOrBackspace(event)) {
      event.stopPropagation();
      return;
    }

    if (event.key === KEY_ENTER) {
      // Handle Enter key press
      this.params.api.stopEditing();
      this.params.api.dispatchEvent({
        type: 'cellEditingStopped',
      });
    }

    if (event.key === KEY_TAB) {
      if (event.shiftKey) {
        this.params.api.tabToPreviousCell();
      } else {
        this.params.api.tabToNextCell();
      }
      event.preventDefault();
    }
    

    if (!this.isKeyPressedNumeric(event)) {
      event.preventDefault();
    }
  }

  onBlur(): void {
    // Handle blur event, stop editing
    this.params.api.stopEditing();
    this.params.api.dispatchEvent({
      type: 'cellEditingStopped',
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.input.nativeElement.focus();
      if (this.highlightAllOnFocus) {
        // Use select method to highlight the content
        this.input.nativeElement.select();
        this.highlightAllOnFocus = false;
      }
    });
  }  

  private isCharNumeric(charStr: string): boolean {
    return !!/\d/.test(charStr);
  }

  private isKeyPressedNumeric(event: KeyboardEvent): boolean {
    const charStr = event.key;
    if (charStr === '.') {
      return true;
    }
    if (charStr === '-') {
      return true;
    }
    return this.isCharNumeric(charStr);
  }

  private deleteOrBackspace(event: KeyboardEvent): boolean {
    return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.key) > -1;
  }
}
