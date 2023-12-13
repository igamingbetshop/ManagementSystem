import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';

import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';

@Component({
  selector: 'app-mapped-result-types-grid',
  templateUrl: './mapped-result-types-grid.component.html',
  styleUrls: ['./mapped-result-types-grid.component.scss']
})
export class MappedResultTypesGridComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Input() isCanNotSelect = true;
  @Output() callParent: EventEmitter<void> = new EventEmitter<void>();

  public rowData = [];

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        filter: 'agTextColumnFilter',
        cellStyle: { 'padding-left': '50px' },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },

    ];
  }

  onRowSelected() {
    this.callParent.emit();
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.agGrid?.api.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {

        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = 1000;
        paging.SportIds = null;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost('common/resulttypes', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            params.success({ rowData: data.Objects, rowCount: data.TotalCount });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      },
    };
  }

  onPageSizeChanged() {
    this.agGrid.api.paginationSetPageSize(Number(this.cacheBlockSize));
  }

}
