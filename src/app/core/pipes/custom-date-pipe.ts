import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      console.warn('Invalid Date:', value);
      return '';
    }

    return this.datePipe.transform(date, 'MMM d, yyyy');
  }
}
