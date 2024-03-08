import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridModule } from 'ag-grid-angular';
import { take } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import { GridRowModelTypes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';

@Component({
  selector: 'app-mapped-regions-grid',
  templateUrl: './mapped-regions-grid.component.html',
  styleUrls: ['./mapped-regions-grid.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    TranslateModule
  ]
})
export class MappedRegionsGridComponent extends BasePaginatedGridComponent implements OnInit {

  @Output() callParent: EventEmitter<void> = new EventEmitter<void>();
  @Input() isCanNotSelect = true;

  public rowData = [];
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Sport.RegionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
    ];

  }

  ngOnInit() {
    this.getRows();
  }

  getRows() {
    this.apiService.apiPost('regions')
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.getRows()
  }

  onRowSelected() {
    this.callParent.emit();
  }

}
