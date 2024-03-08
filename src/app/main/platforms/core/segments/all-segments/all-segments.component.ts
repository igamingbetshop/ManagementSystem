import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { CommonDataService } from 'src/app/core/services/common-data.service';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-all-segments',
  templateUrl: './all-segments.component.html',
  styleUrls: ['./all-segments.component.scss']
})
export class AllSegmentsComponent extends BasePaginatedGridComponent implements OnInit {

  public partners: any[] = [];
  public clientStates: any[] = [];
  public partnerSettings: any[] = [];
  public filterOperating: any[] = [];
  public partnerId = null;

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public filter: any = {};
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
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SEGMENTS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',

      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
      },
      {
        headerName: 'Segments.Mode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Mode',
      },
      {
        headerName: 'Common.Gender',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Gender',
      },
      {
        headerName: 'Segments.IsKYCVerified',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsKYCVerified',
      },
      {
        headerName: 'Clients.ClientStatus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientStatus',
      },
      {
        headerName: 'Segments.AffiliateId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AffiliateId',
      },
      {
        headerName: 'Segments.Bonus',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Bonus',
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
      },
      {
        headerName: 'Segments.DepositPaymentSystems',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SuccessDepositPaymentSystem',
      },
      {
        headerName: 'Clients.Email',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Email',
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
      },
      {
        headerName: 'Segments.MobileCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MobileCode',
      },
      {
        headerName: 'Clients.Region',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Region',
      },
      {
        headerName: 'Bonuses.SegmentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SegmentId',
      },
      {
        headerName: 'Segments.WithdrawalPaymentSystem',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SuccessWithdrawalPaymentSystem',
      },
      {
        headerName: 'Segments.SessionPeriod',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SessionPeriod',
      },
      {
        headerName: 'Segments.SignUpPeriod',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SignUpPeriod',
      },
      {
        headerName: 'Segments.TotalBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsCount',
      },
      {
        headerName: 'Segments.SportBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportBetsCount',
      },
      {
        headerName: 'Segments.CasinoBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CasinoBetsCount',
      },
      {
        headerName: 'Segments.TotalBetsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsAmount',
      },
      {
        headerName: 'Segments.TotalDepositsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDepositsCount',
      },
      {
        headerName: 'Segments.TotalDepositsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDepositsAmount',
      },
      {
        headerName: 'Segments.TotalWithdrawalsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWithdrawalsCount',
      },
      {
        headerName: 'Segments.TotalWithdrawalsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWithdrawalsAmount',
      },
      {
        headerName: 'Segments.ComplimentaryPoint',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ComplimentaryPoint',
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: 'segment', queryParams: null };
          // let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          // data.path = this.router.url.replace(replacedPart, 'segment');
          data.queryParams = { segmentId: params.data.Id };
          return data;
        },
        sortable: false
      },
    ];
  }

  ngOnInit() {
    this.clientStates = this.activateRoute.snapshot.data.clientStates;
    this.gridStateName = 'core-banners-grid-state';
    this.partners = this.commonDataService.partners;
    this.getFilterOperation();
    this.getPage();
  }

  getFilterOperation() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_FILTER_OPTIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.filterOperating = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  onPartnerChange(val) {
    this.partnerId = null;
    this.partnerId = val;
    this.getPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  async addSegment() {
    const { AddSegmentComponent } = await import('../add-segment/add-segment.component');
    const dialogRef = this.dialog.open(AddSegmentComponent, {
      width: ModalSizes.MEDIUM,
      data: { ClientStates: this.clientStates, FilterOperating: this.filterOperating }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  async deleteSegment() {
    const row = this.gridApi.getSelectedRows()[0];
    const { ConfirmComponent } = await import('../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.configService.getApiUrl, row,
          true, Controllers.CONTENT, Methods.DELETE_SEGMENT)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.getPage();
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    })
  }

  getPage() {
    if (this.partnerId != null) {
      this.filter.PartnerId = this.partnerId;
    } else {
      delete this.filter.PartnerId;
    }

    this.apiService.apiPost(this.configService.getApiUrl, this.filter,
      true, Controllers.CONTENT, Methods.GET_SEGMENTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {

          this.rowData = data.ResponseObject.map((items) => {

            items.PartnerName = this.partners.find((item => item.Id === items.PartnerId))?.Name;
            return items;
          });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      });
  }
}
