import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { take } from 'rxjs/operators';

import { GridRowModelTypes } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';

@Component({
  selector: 'app-unmaped-phases',
  templateUrl: './unmaped-phases.component.html',
  styleUrls: ['./unmaped-phases.component.scss']
})
export class UnmapedPhasesComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  @Output() valueEmitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() sports: any[] = [];
  @Input() providers: any[] = [];

  public rowData = [];
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
        field: 'ExternalId',
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
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportNickName',
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
    this.getRows();
  }

  onRowSelected() {
    this.valueEmitted.emit(false);
  }

  getRows() {
    const paging = new Paging();
    paging.PageIndex = this.paginationPage - 1;
    paging.PageSize = this.cacheBlockSize;
    paging.ObjectTypeId = 11;
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
  }


}
