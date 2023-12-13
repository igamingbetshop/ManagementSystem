import { AfterViewInit, Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-editor-cell',
  template: `
  <div class="label" style="display: flex; justify-content: center; align-items: center;">
    <input  #i type="color" name="head" [value]="params.value" />
  </div>
  `
})
export class ColorEditorComponent implements AfterViewInit {
  @ViewChild('i') colorInput;
  params;

  ngAfterViewInit() {
    setTimeout(() => {
      this.colorInput.nativeElement.click();

    });
  }

  agInit(params: any): void {
    this.params = params;
  }

  getValue() {
    return this.colorInput.nativeElement.value;
  }


}
