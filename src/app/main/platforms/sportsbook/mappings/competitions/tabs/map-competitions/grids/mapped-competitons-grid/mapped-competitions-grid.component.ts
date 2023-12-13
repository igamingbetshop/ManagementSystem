import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';

import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mapped-competitions-grid',
  templateUrl: './mapped-competitions-grid.component.html',
  styleUrls: ['./mapped-competitions-grid.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    AgGridModule,
    MatSelectModule,
    FormsModule
  ]
})
export class MappedCompetitionsGridComponent extends BasePaginatedGridComponent {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Input() sports: any[] = [];
  @Input() providers: any[] = [];
  @Input() sportId: number | null;
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
        headerName: 'Payments.CompetitionsId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
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
        field: 'SportName',
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
        headerName: 'Clients.Region',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
    ];
  }

  isUnknownRowSelected() {
    return this.agGrid.api && this.agGrid.api.getSelectedRows().length === 0;
  };


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
        paging.SportIds = null;

        if (this.sportId) {
          paging.SportIds = {
            IsAnd: true,
            ApiOperationTypeList: [{ IntValue: this.sportId, OperationTypeId: 1 }]
          };
        } else {
          delete paging.SportIds;
        }

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost('competitions', paging,
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

  onRowSelected() {
    this.callParent.emit();
  }

}
