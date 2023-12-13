import {Pipe, PipeTransform} from '@angular/core';
declare var Fraction: any;

@Pipe({
  name: 'oddsType'
})
export class OddsTypePipe implements PipeTransform {

  private toFixedNoRound(number, precision = 1) {
    const factor = Math.pow(10, precision);
    return Math.floor(number * factor) / factor;
  }

  private to3Fixed(num: any) {

    num = Number(num);
    if (typeof num === 'undefined')
      return '';

    if (num >= 0 && num <= 1.1)
      return this.toFixedNoRound(num, 3);
    else if (num > 1.1 && num < 10)
      return this.toFixedNoRound(num, 2);
    else if (num >= 10 && num <= 100)
      return this.toFixedNoRound(num, 1);
    else
      return this.toFixedNoRound(num, 0);
  }

  transform(number: any, selectedOddTypeIndex?: any, marketTypeId?: number, bet?: any): any {

    if (selectedOddTypeIndex === 2) {
      number--;
      let f = new Fraction(parseFloat(number));
      return f.numerator + "/" + f.denominator;

    } else if (selectedOddTypeIndex === 3) {
      if (marketTypeId) {
        return number.toFixed(2);
      }

      return number >= 2 ? '+' + ((number - 1) * 100).toFixed(2) : (-100 / (number - 1)).toFixed(2);

    } else if (selectedOddTypeIndex === 4) {
      if (marketTypeId) {
        return number.toFixed(2);
      }

      return (number - 1).toFixed(2);

    } else if (selectedOddTypeIndex === 5) {
      if (marketTypeId) {
        return number.toFixed(2);
      }

      return (number >= 2 ? -1 / (number - 1) : number - 1).toFixed(2);

    } else if (selectedOddTypeIndex === 6) {
      if (bet)
        number = bet.WinAmount / bet.BetAmount;

      if (marketTypeId) {
        return number.toFixed(2);
      }

      return (number >= 2 ? number - 1 : -(Math.floor(100 / (number - 1)) / 100)).toFixed(2);
    } else if (selectedOddTypeIndex === 7) {
      return number.toFixed(2);
    } else {

      return this.to3Fixed(number);
    }
  }
}
