import { Component, ViewEncapsulation } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';

@Component({
  standalone: true,
  selector: 'tooltip-component',
  template: ` <div class="custom-tooltip" [style.background-color]="data.color">
    <p>
      <span> {{ value }}</span>
    </p>
  </div>`,
  styles: [`
      :host {
        width: 140px;
        height: 30px;
        color: #076192!important;
        background: #C1D7E3!important;
        pointer-events: none;
        transition: opacity 1s;
        text-align: center;
        font-size: 14px!important;
        line-height: 16px!important;
      }

      :host.ag-tooltip-hiding {
        opacity: 1s;
      }

      .custom-tooltip p {
        margin: 5px;
        white-space: nowrap;
      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `,
  ],
})
export class CustomTooltip implements ITooltipAngularComp {
  public params: any;
  public data: any;
  public value: any;
  isTotal: true;

  agInit(params): void {
    this.params = params;
    this.value = params.value;
    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    this.data.color = this.params;
  }
}
