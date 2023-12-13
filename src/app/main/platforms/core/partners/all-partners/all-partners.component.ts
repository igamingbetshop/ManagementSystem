import {Component, Injector, ViewChild} from "@angular/core";
import {AgGridAngular} from "ag-grid-angular";
import 'ag-grid-enterprise';
import {Controllers, GridMenuIds, Methods, ModalSizes} from "../../../../../core/enums";
import {take} from "rxjs/operators";
import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {MatDialog} from "@angular/material/dialog";
import {Paging} from "../../../../../core/models";
import {CommonDataService} from "../../../../../core/services";
import {AgBooleanFilterComponent} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {CoreApiService} from "../../services/core-api.service";
import {DatePipe} from "@angular/common";
import { syncColumnSelectPanel } from "src/app/core/helpers/ag-grid.helper";

@Component({
  selector: 'all-partners',
  templateUrl: './all-partners.component.html',
  styleUrls: ['./all-partners.component.scss']
})
export class AllPartnersComponent extends BasePaginatedGridComponent {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public frameworkComponents;
  public partnerStates;
  public clientData;

  constructor(protected injector: Injector,
              public dialog: MatDialog,
              private apiService: CoreApiService,
              private commonDataService: CommonDataService) {
    super(injector);
    this.adminMenuId = GridMenuIds.PARTNERS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        minWidth: 90,
        suppressToolPanel: false
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Partners.SiteUrl',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SiteUrl',
        resizable: true,
        sortable: false
      },
      {
        headerName: 'Partners.AdminSiteUrl',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AdminSiteUrl',
        resizable: true,
        sortable: true
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        resizable: true,
        sortable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = {path: '', queryParams: null};
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'partner');
          data.queryParams = {partnerId: params.data.Id, partnerName: params.data.Name};
          return data;
        },
        sortable: false
      },
    ];
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent
    }
  }


  ngOnInit() {
    this.gridStateName = 'partners-grid-state';
    this.getPartnerStates();
    super.ngOnInit();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  getSelectedRows(): void {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        // paging.TakeCount = this.cacheBlockSize;
        paging.TakeCount = Number(this.cacheBlockSize);
        this.clientData = paging;

        this.setSort(params.request.sortModel, paging);

        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.PARTNER, Methods.GET_PARTNERS).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            const mappedRows = data.ResponseObject.Entities;
            mappedRows.forEach((entity) => {
              let statusName = this.partnerStates.find((st) => {
                return st.Id == entity.State;
              })
              if(statusName){
                entity['State'] = statusName.Name;
              }
            })
            params.success({rowData: mappedRows, rowCount: data.ResponseObject.Count});
          }
        });
      },
    };
  }

  private getPartnerStates() {
    this.apiService.apiPost(this.configService.getApiUrl, null, true,
      Controllers.ENUMERATION, Methods.GET_PARTNER_STATES).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.partnerStates = data.ResponseObject;
      }
    });
  }

  async createPartner() {
    const {CreatePartnerComponent} = await import('../../partners/create-partner/create-partner.component');
    const dialogRef = this.dialog.open(CreatePartnerComponent, {width: ModalSizes.LARGE});

    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getCurrentPage();
    })
  }

  exportToCsv() {
    this.apiService.apiPost(this.configService.getApiUrl, {...this.clientData, adminMenuId: this.adminMenuId}, true,
      Controllers.PARTNER, Methods.EXPORT_PARTNERS_MODEL).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.WebApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      }
    });
  }

}
