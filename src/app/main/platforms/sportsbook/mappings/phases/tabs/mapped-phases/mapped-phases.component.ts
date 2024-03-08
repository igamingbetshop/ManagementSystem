import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-mapped-phases',
  templateUrl: './mapped-phases.component.html',
  styleUrls: ['./mapped-phases.component.scss']
})
export class MappedPhasesTabComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
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
    public dialog: MatDialog,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Sport.TeamsExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectExternalId',
      },
      {
        headerName: 'Sport.Teams',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectExternalName',
      },
      {
        headerName: 'Partners.Provider',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
      },
      {
        headerName: 'Sport.TeamId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectId',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectNickName',
      },

    ];
  }

  ngOnInit() {
    this.gridStateName = 'mapped-phases-grid-state';
    this.getProviders();
    this.getPage();
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

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  mapping() {
    let row = this.gridApi.getSelectedRows()[0];
    let model = {
      Id: row.Id
    };
    this.apiService.apiPost('common/cancelmapping', model).subscribe(data => {
      if (data.Code === 0) {
        this.getPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  async cancel() {
    const { ConfirmComponent } = await import('../../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.mapping();
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  getPage() {
    let filter = {
      PageIndex: 0,
      PageSize: 5000,
      ObjectTypeId: 1
    }
    this.apiService.apiPost('matches/mappedphases', filter,
    ).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.rowData = data.ResponseObject;
        this.rowData.forEach(sport => {
          let providerName = this.providers.find((provider) => {
            return provider.Id == sport.ProviderId;
          })
          if (providerName) {
            sport['ProviderName'] = providerName.Name;
          }
        })
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });

  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.getPage()
  }

}
