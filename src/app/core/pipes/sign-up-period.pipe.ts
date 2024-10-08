import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signUpPeriod',
  standalone: true,
})
export class SignUpPeriodPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const parts = value.split('&');
    const formattedParts = parts.map(part => {
      const datePart = part.split('T')[0];
      return part.includes('=') ? ` ${datePart}` : `>= ${datePart}`;
    });

    return formattedParts.join(' ');
  }
}