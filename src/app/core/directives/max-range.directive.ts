import {Directive, inject, input, Input} from '@angular/core';
import {MAT_DATE_RANGE_SELECTION_STRATEGY} from "@angular/material/datepicker";
import {MaxRangeSelectionStrategy} from "./max-range-selection-strategy";

@Directive({
  selector: '[bsMaxRange]',
  standalone: true,
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: MaxRangeSelectionStrategy
    }
  ]
})
export class MaxRangeDirective {

  maxRangeStrategy:MaxRangeSelectionStrategy<any> = inject(MAT_DATE_RANGE_SELECTION_STRATEGY) as MaxRangeSelectionStrategy<any>;
  bsMaxRange = input(0, {transform: (value:number | string) => {
      return this.maxRangeStrategy.delta = +value || 7;
    }});
}
