import { Directive, ElementRef, forwardRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[appDateTimePicker]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerValueAccessorDirective),
      multi: true,
    },
  ],
  standalone: true,
  
})
export class DateTimePickerValueAccessorDirective implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  writeValue(value: string): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
    this.renderer.listen(this.elementRef.nativeElement, 'input', (event) => {
      this.onChange(event.target.value);
    });
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
    this.renderer.listen(this.elementRef.nativeElement, 'blur', () => {
      this.onTouched();
    });
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
