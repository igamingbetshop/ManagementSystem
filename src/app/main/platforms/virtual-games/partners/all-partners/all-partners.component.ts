import { Component, Injector, OnInit } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../components/classes/base-paginated-grid-component";
import { VirtualGamesApiService } from "../../services/virtual-games-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { GridMenuIds, GridRowModelTypes } from "../../../../../core/enums";
import { CommonDataService } from "../../../../../core/services";
import { OpenerComponent } from "../../../../components/grid-common/opener/opener.component";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-all-partners',
  templateUrl: './all-partners.component.html',
  styleUrls: ['./all-partners.component.scss']
})
export class AllPartnersComponent extends BasePaginatedGridComponent implements OnInit {
  public path = 'partners';
  public rowData = [];
  public partners;
  public status = ACTIVITY_STATUSES;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    public apiService: VirtualGamesApiService,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar) {
    super(injector);
    this.adminMenuId = GridMenuIds.VG_PARTNERS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        resizable: true,
        sortable: true,
      },
      // {
      //   headerName: 'SiteUrl',
      //   field: 'SiteUrl',
      //   resizable: true,
      //   sortable: true,
      // },
      // {
      //   headerName: 'Admin Site Url',
      //   field: 'AdminSiteUrl',
      //   resizable: true,
      //   sortable: true,
      // },
      // {
      //   headerName: 'State',
      //   field: 'StateName',
      //   resizable: true,
      //   sortable: true,
      // },
      // {
      //   headerName: 'Creation Time',
      //   field: 'CreationTime',
      //   resizable: true,
      //   sortable: true,
      //   cellRenderer: function (params) {
      //     let datePipe = new DatePipe("en-US");
      //     let dat = datePipe.transform(params.data.CreationTime, 'medium');
      //     if (!params.data.CreationTime) {
      //       return ''
      //     } else {
      //       return `${dat}`;
      //     }
      //   },
      // },
      // {
      //   headerName: 'Last Update',
      //   field: 'LastUpdateTime',
      //   resizable: true,
      //   sortable: true,
      //   cellRenderer: function (params) {
      //     let datePipe = new DatePipe("en-US");
      //     let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
      //     if (!params.data.LastUpdateTime) {
      //       return ''
      //     } else {
      //       return `${dat}`;
      //     }
      //   },
      // },
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
    ]
  }

  ngOnInit(): void {
    this.getPartners();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPartners() {
    this.partners = this.commonDataService.partners;
    this.rowData = this.partners;
  }

  createPartner() {
    // TODO handle add partner
  }

}
