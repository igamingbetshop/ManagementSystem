import { Component, OnInit, Injector } from '@angular/core';

import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import 'ag-grid-enterprise';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
// import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { GridMenuIds, GridRowModelTypes, ModalSizes, PBControllers, PBMethods } from 'src/app/core/enums';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { PoolBettingApiService } from '../../../sportsbook/services/pool-betting-api.service';
import { ActivatedRoute } from '@angular/router';

const bannerVisibilityTypes = [
  { id: null, name: 'Always' },
  { id: '1', name: 'Logged Out' },
  { id: '2', name: 'Logged In' },
  { id: '3', name: 'No Deposit' },
  { id: '4', name: 'One Deposit Only' },
  { id: '5', name: 'Two Or More Deposits' }
];


@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  isSendingReqest = false;
  public partners: any[] = [];
  public partnerId = null;
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
    private apiService: PoolBettingApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.PB_BANERS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Cms.Body',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Body',
      },
      {
        headerName: 'Cms.Head',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Head',
      },
      {
        headerName: 'Cms.Image',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Image',
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
      },
      {
        headerName: 'Cms.ShowDescription',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ShowDescription',
        resizable: true,
      },
      {
        headerName: 'Common.StartDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartDate',
      },
      {
        headerName: 'Common.EndDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'EndDate',
      },
      {
        headerName: 'Common.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
      },
      {
        headerName: 'Cms.IsEnabled',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsEnabled',
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
      },
      {
        headerName: 'Common.Visibility',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Visibility',
      },
      {
        headerName: 'Cms.ShowLogin',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ShowLogin',
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: 'banner', queryParams: null };
          data.queryParams = { Id: params.data.Id };
          return data;
        },
        sortable: false
      },
    ];
  }

  ngOnInit() {
    this.getPartners();
    this.gridStateName = 'sport-banner-grid-state';
    this.getPage();
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
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

  async addBanner() {
    const { AddBannerComponent } = await import('./add-banner/add-banner.component');
    const dialogRef = this.dialog.open(AddBannerComponent, { width: ModalSizes.LARGE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  deleteBanner() {
    const row = this.gridApi.getSelectedRows()[0];
    delete row.UserId;
    delete row.CurrencyId;
    this.isSendingReqest = true;
    this.apiService.apiPost(PBControllers.CMS, PBMethods.DELETE_BANNER,row).subscribe(data => {

      if (data.Code === 0) {
        this.getPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPage() {
    const pageFilter = {
      PartnerId: this.partnerId ? this.partnerId : null,
      TakeCount: 5000,
      SkipCount: 0
    };
    this.apiService.apiPost(PBControllers.CMS, PBMethods.BANNERS, pageFilter,)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {

          const mappedRows = data.Banners;

          mappedRows.forEach((payment) => {
            let partnerName = this.partners.find((partner) => {
              return partner.Id == payment.PartnerId;
            })
            if (partnerName) {
              payment['PartnerId'] = partnerName.Name;
            }

            let VisibilityName = bannerVisibilityTypes.find((type) => {
              return type.id == payment.Visibility;
            })
            if (VisibilityName) {
              payment['Visibility'] = VisibilityName.name;
            }
            this.rowData = mappedRows

          })

          // params.success({rowData: mappedRows, rowCount: mappedRows.length});
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });


  };


}
