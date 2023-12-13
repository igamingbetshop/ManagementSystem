import { AfterViewInit, Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-text-editor-cell',
  template: `
    <input #i [value]="params.value" />
  `,
  styles: [' input {width: 95%; padding: 5px 10px; outline: none;}']
})
export class TextEditorComponent implements AfterViewInit {
  @ViewChild('i') textInput;
  params;

  ngAfterViewInit() {
    setTimeout(() => {
      this.textInput.nativeElement.focus();
    });
  }

  agInit(params: any): void {
    this.params = params;
  }

  getValue() {
    return this.textInput.nativeElement.value;
  }
}
