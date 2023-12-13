import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';

import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';

@Component({
  selector: 'app-unmapped-result-types-grid',
  templateUrl: './unmapped-result-types-grid.component.html',
  styleUrls: ['./unmapped-result-types-grid.component.scss']
})
export class UnmappedResultTypesGridComponent extends BasePaginatedGridComponent {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Output() valueEmitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() sports: any[] = [];
  @Input() providers: any[] = [];
  @Input() sportId: number | null;

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
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Partners.Provider',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportNickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Payments.Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationDate',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationDate, 'medium');
          return `${dat}`;
        },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
    ];
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
        paging.PageSize = this.cacheBlockSize;
        paging.ObjectTypeId = 21;
        paging.SportIds = this.sportId;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost('common/unknowns', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            const mappedRows = data.Objects;
            mappedRows.forEach(sport => {
              let providerName = this.providers.find((provider) => {
                return provider.Id == sport.ProviderId;
              })
              if (providerName) {
                sport['ProviderName'] = providerName.Name;
              }
            })
            params.success({ rowData: mappedRows, rowCount: data.TotalCount });
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

  onRowSelected() {
    this.valueEmitted.emit(false);
  }

}
