import {Pipe, PipeTransform} from '@angular/core';
declare var Fraction: any;


@Pipe({
  name: 'oddsType'
})
export class OddsTypePipe implements PipeTransform {

  transform(number: any, selectedOddTypeIndex?: any, marketTypeId?: number, bet?: any): any {
    if (selectedOddTypeIndex === 2) {
      // Fraction representation
      number--;
      let f = new Fraction(parseFloat(number));
      return `${f.numerator}/${f.denominator}`;
    } else if (selectedOddTypeIndex === 3) {
      // American (+/-) odds
      if (marketTypeId) {
        return number.toFixed(2);
      }
      return number >= 2 ? `+${((number - 1) * 100).toFixed(2)}` : `-${(100 / (number - 1)).toFixed(2)}`;
    } else if (selectedOddTypeIndex === 4) {
      // Decimal odds
      if (marketTypeId) {
        return number.toFixed(2);
      }
      return (number - 1).toFixed(2);
    } else if (selectedOddTypeIndex === 5) {
      // Malay odds
      if (marketTypeId) {
        return number.toFixed(2);
      }
      return (number >= 2 ? (-1 / (number - 1)) : (number - 1)).toFixed(2);
    } else if (selectedOddTypeIndex === 6) {
      // Hong Kong odds
      if (bet) {
        number = bet.WinAmount / bet.BetAmount;
      }
      if (marketTypeId) {
        return number.toFixed(2);
      }
      return (number >= 2 ? (number - 1) : (-(Math.floor(100 / (number - 1)) / 100))).toFixed(2);
    } else if (selectedOddTypeIndex === 7) {
      // Fixed odds
      return number.toFixed(2);
    } else {
      // Default case: to3Fixed
      return this.to3Fixed(number);
    }
  }

  private to3Fixed(num: any): string {
    num = Number(num);
    if (typeof num === 'undefined') {
      return '';
    }
    if (num >= 0 && num <= 1.1) {
      return this.toFixedNoRound(num, 3);
    } else if (num > 1.1 && num < 10) {
      return this.toFixedNoRound(num, 2);
    } else if (num >= 10 && num <= 100) {
      return this.toFixedNoRound(num, 1);
    } else {
      return this.toFixedNoRound(num, 0);
    }
  }

  private toFixedNoRound(number: number, precision: number = 1): string {
    const factor = Math.pow(10, precision);
    return (Math.floor(number * factor) / factor).toFixed(precision);
  }
}
