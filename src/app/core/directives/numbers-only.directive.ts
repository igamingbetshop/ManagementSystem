import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[numbersOnly]',
  standalone: true
})
export class NumbersOnlyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const value = inputElement.value;
    inputElement.value = value.replace(/[^0-9]/g, '').slice(0, 6);
    if (value !== inputElement.value) {
      event.stopPropagation();
    }
  }
}