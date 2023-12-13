import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {Controllers, GridMenuIds, Methods, ModalSizes} from 'src/app/core/enums';
import 'ag-grid-enterprise';
import {CommonDataService} from 'src/app/core/services';
import {take} from 'rxjs/operators';
import {CoreApiService} from "../services/core-api.service";
import {CellClickedEvent} from 'ag-grid-community';
import {MatDialog} from "@angular/material/dialog";
import {SnackBarHelper} from "../../../../core/helpers/snackbar.helper";
import {Paging} from "../../../../core/models";

@Component({
  selector: 'app-real-time',
  templateUrl: './real-time.component.html',
  styleUrls: ['./real-time.component.scss']
})
export class RealTimeComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public partnerId;
  public partners: any[] = [];
  public clientCategories: any[] = [];
  public allRegions: any[] = [];

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.REAL_TIME
    this.columnDefs = [
      {
        headerName: 'Clients.Indications',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: function (params) {
          let flag = `<img class="flag" title="language" src="/assets/images/flags/${params.data.SessionLanguage}.png" alt="flag" >`;
          let documentVerified = !params.data.IsDocumentVerified ? `<mat-icon title="verify document" data-action-type="view-note" class="mat-icon material-icons">forward</mat-icon>` : "";
          let oldUser = params.data.OldUser ? `<mat-icon title="returned player" data-action-type="view-note" class="mat-icon material-icons">insert_drive_file</mat-icon>` : "";
          let totalDepositsCount = params.data.TotalDepositsCount > 0 ? `<mat-icon title="depositor player" data-action-type="view-note" class="mat-icon material-icons">monetization_on</mat-icon>` : "";
          let lastDepState = ([1, 3, 4, 5, 6, 7, 9].includes(params.data.LastDepositState)) ? `<mat-icon title="last deposit failed" data-action-type="view-note" class="mat-icon material-icons">assistant_photo</mat-icon>` : '';
          return `<div class="indication-content">${flag} ${documentVerified} ${oldUser} ${totalDepositsCount} ${lastDepState}</div>`;
        },
        width: 550,
        resizable: true,
      },
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellStyle: {cursor: 'pointer', 'text-decoration': 'underline'},
        onCellClicked: (event: CellClickedEvent) => this.goToClient(event),
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        sortable: true,
        resizable: true,
        cellStyle: {cursor: 'pointer', 'text-decoration': 'underline'},
        onCellClicked: (event: CellClickedEvent) => this.goToClient(event),
      },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        minWidth: 200,
        cellRenderer: function (params) {
          const note = `<mat-icon data-action-type="view-note" class="mat-icon material-icons" style="font-size: 18px; width: 18px; height: 20px; vertical-align: middle"> ${params.data.HasNote ? 'folder' : 'folder_open'}</mat-icon>`;
          const names = `<span data-action-type="view-name">${params.data.FirstName} ${params.data.LastName}</span>`;
          return `${note} ${names}`;
        },
        cellStyle: {cursor: 'pointer', 'text-decoration': 'underline'},
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.Country',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CountryName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Products.CategoryId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Segments.LoginIp',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LoginIp',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Segments.CurrentPage',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrentPage',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Dashboard.DepositPend',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Deposit/Pend',
        cellRenderer: function (params) {
          return `${params.data.TotalDepositsCount}/${params.data.PendingDepositsCount}`;
        },

        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Segments.TotalDepositsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalDepositsAmount',
        cellRenderer: function (params) {
          return `${params.data.TotalDepositsAmount}/${params.data.PendingDepositsAmount}`;
        },
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Dashboard.WithdrawalsPend',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Withdrawals/Pend',
        cellRenderer: function (params) {
          return `${params.data.TotalWithdrawalsCount}/${params.data.PendingWithdrawalsCount}`;
        },
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Segments.TotalWithdrawalsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalWithdrawalsAmount',
        cellRenderer: function (params) {
          return `${params.data.TotalWithdrawalsAmount}/${params.data.PendingWithdrawalsAmount}`;
        },
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Dashboard.GGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GGR',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.Bets',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TotalBetsCount',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.SessionTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SessionTime',
        filter: false,
        sortable: true,
        resizable: true,

        valueFormatter: function (params) {
          const value = params.data.SessionTime;
          let sec_num = parseInt(value, 10)
          let hours = Math.floor(sec_num / 3600)
          let minutes = Math.floor(sec_num / 60) % 60
          let seconds = sec_num % 60
          return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
        },

      },
      {
        headerName: 'Common.Balance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Balance',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
      },

    ]
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.clientCategories = data.clientCategory
    });
    this.getRegions();
    this.partners = this.commonDataService.partners;
    this.gridStateName = 'real-time-grid-state';
  }

  goToClient(event) {
    const row = event.data;
    const url = this.router.navigate(['/main/platform/clients/all-clients/client/main'], {queryParams: {"clientId": row.Id}});
  }

  onPartnerChange(value: number) {
    this.partnerId = value;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {
        let paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.configService.getApiUrl, paging, true, Controllers.DASHBOARD, Methods.GET_ONLINE_CLIENTS)
          .subscribe((data) => {
            if (data.ResponseCode === 0) {
              let now = new Date();
              now.setDate(now.getDate() - 1);
              const mappedRows = data.ResponseObject.OnlineClients;
              mappedRows.forEach(res => {
                let category = this.clientCategories.find(cat => {
                  return cat.Id == res.CategoryId;
                });
                if (category) {
                  res['CategoryName'] = category.Name;
                }

                let country = this.allRegions.find(region => {
                  return region.Id == res.RegionId;
                });

                if (country) {
                  res['CountryName'] = country.Name;
                }
                res['OldUser'] = now > new Date(res.RegistrationDate);

              })
              params.success({rowData: mappedRows, rowCount: data.ResponseObject.Count});

            } else {
              SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
            }
          });
      },
    };
  };


  private getRegions() {
    this.apiService.apiPost(this.configService.getApiUrl, {TypeId: null}, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.allRegions = data.ResponseObject;
      }
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "view-name":
          return this.goToClient(data);
        case "view-note":
          return this.openNotes(data);
      }
    }
  }

  async openNotes(params) {
    const {ViewNoteComponent} = await import('../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: {ObjectId: params.data.Id, ObjectTypeId: 2, Type: 1}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) { }
    });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

}
