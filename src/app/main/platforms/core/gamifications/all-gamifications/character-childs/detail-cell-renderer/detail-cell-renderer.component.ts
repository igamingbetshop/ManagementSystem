import { Component } from '@angular/core';

@Component({
  selector: 'app-detail-cell-renderer',
  template: `
    <div class="ag-theme-balham" style="height: 100%; width: 100%;">
      <ag-grid-angular
        #agGrid
        [rowData]="params.data.Children" 
        [columnDefs]="params.detailGridOptions.columnDefs"
        [defaultColDef]="params.detailGridOptions.defaultColDef"
        [components]="params.frameworkComponents"
        (firstDataRendered)="onFirstDataRendered($event)"
      ></ag-grid-angular>
    </div>
  `,
})
export class DetailCellRendererComponent {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  onFirstDataRendered(event: any): void {
    event.api.sizeColumnsToFit();
  }
}
