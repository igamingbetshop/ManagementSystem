import { Component, Injector, OnInit } from '@angular/core';
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { CoreApiService } from "../../services/core-api.service";
import { take } from 'rxjs/operators';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { CellClickedEvent } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-providers',
  templateUrl: './all-providers.component.html',
  styleUrls: ['./all-providers.component.scss']
})
export class AllProvidersComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    public activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Providers.SessionExpireTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SessionExpireTime',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Providers.GameLaunchUrl',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameLaunchUrl',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        filter: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }
          return `<i style="color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
            visibility
          </i>`;
        },
        onCellClicked: (event: CellClickedEvent) => this.redirectToProvider(event),
      },
    ]

  }

  ngOnInit() {
    this.gridStateName = 'all-providers-grid-state';
    this.getPage();
    super.ngOnInit();    
  }

  redirectToProvider(params) {
    this.router.navigate(['/main/platform/providers/all-providers/provider'], {
      queryParams: { providerId: params.data.Id }
    });
  }

  async addProviders() {
    const { CreateProviderComponent } = await import('../../providers/create-provider/create-provider.component');
    const dialogRef = this.dialog.open(CreateProviderComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getPage();
    })
  }

  getPage() {
    this.apiService
      .apiPost(
        this.configService.getApiUrl,
        {},
        true,
        Controllers.PRODUCT,
        Methods.GET_GAME_PROVIDERS
      )
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

}
