import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridModule } from 'ag-grid-angular';
import { take } from 'rxjs/operators';
import { GridRowModelTypes } from 'src/app/core/enums';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { TranslateModule } from '@ngx-translate/core';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';

@Component({
  selector: 'app-unmapped-regions-grid',
  templateUrl: './unmapped-regions-grid.component.html',
  styleUrls: ['./unmapped-regions-grid.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    TranslateModule
  ]
})
export class UnmappedRegionsGridComponent extends BasePaginatedGridComponent implements OnInit {

  @Output() valueEmitted: EventEmitter<boolean> = new EventEmitter<boolean>();


  public rowData = [];
  public isCanNotSelect = true;

  public providers: any[] = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };

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
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
      },
      {
        headerName: 'Partners.Provider',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
      },
      {
        headerName: 'Payments.Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationDate',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationDate, 'medium');
          return `${dat}`;
        },
      },
    ];
  }

  ngOnInit() {
    this.getProviders();
    this.getRows();
  }

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  getRows() {
    const paging = new Paging();
    paging.PageIndex = this.paginationPage - 1;
    paging.PageSize = this.cacheBlockSize;
    paging.ObjectTypeId = 2;

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
        this.rowData = mappedRows;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  };

  onRowSelected() {
    this.valueEmitted.emit(false);
  }


}
