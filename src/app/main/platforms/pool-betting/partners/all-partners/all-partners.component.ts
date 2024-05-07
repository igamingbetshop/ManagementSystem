import { Component, OnInit, Injector } from '@angular/core';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { GridMenuIds, GridRowModelTypes, ModalSizes, PBControllers, PBMethods } from 'src/app/core/enums';
import { MatDialog } from "@angular/material/dialog";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { PoolBettingApiService } from '../../../sportsbook/services/pool-betting-api.service';
import { CommonDataService } from 'src/app/core/services';

@Component({
  selector: 'app-all-partners',
  templateUrl: './all-partners.component.html',
  styleUrls: ['./all-partners.component.scss']
})
export class AllPartnersComponent extends BasePaginatedGridComponent implements OnInit {
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  defaultColDef = {
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
    private commonDataService: CommonDataService,
    private apiService: PoolBettingApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_PARTNERS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        cellRenderer: function (params) {
          let status = params.data.State == 1 ? 'Active' : params.data.State == 2 ? 'Blocked' : '';
          return `${status}`;
        }
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'partner');
          data.queryParams = { partnerId: params.data.Id, partnerName: params.data.Name };
          return data;
        },
        sortable: false
      },
    ];
  }

  ngOnInit() {
    this.gridStateName = 'all-partners-grid-state';
    this.rowData = this.commonDataService.partners;
    // this.getPage();
  }

  async addPartner() {
    const { CreatePartnerComponent } = await import('../../partners/create-partner/create-partner.component');
    const dialogRef = this.dialog.open(CreatePartnerComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.rowData.unshift(data);
      this.gridApi.setRowData(this.rowData);
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  // getPage() {
  //   this.apiService.apiPost(PBControllers.PARTNERS,)
  //     .pipe(take(1))
  //     .subscribe((data) => {
  //       if (data.Code === 0) {
  //         this.rowData = data.ResponseObject;
  //       } else {
  //         SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
  //       }
  //     });
  // }
}
