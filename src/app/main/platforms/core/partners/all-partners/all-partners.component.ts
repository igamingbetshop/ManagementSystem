import { Component, Injector, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from "../../../../../core/enums";
import { take } from "rxjs/operators";
import { BasePaginatedGridComponent } from "../../../../components/classes/base-paginated-grid-component";
import { OpenerComponent } from "../../../../components/grid-common/opener/opener.component";
import { MatDialog } from "@angular/material/dialog";
import { Paging } from "../../../../../core/models";
import { AgBooleanFilterComponent } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { CoreApiService } from "../../services/core-api.service";
import { DatePipe } from "@angular/common";
import { syncColumnSelectPanel } from "src/app/core/helpers/ag-grid.helper";
import { ValueFormatterParams } from "ag-grid-enterprise";
import { SnackBarHelper } from "src/app/core/helpers/snackbar.helper";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ExportService } from "../../services/export.service";

@Component({
  selector: 'all-partners',
  templateUrl: './all-partners.component.html',
  styleUrls: ['./all-partners.component.scss']
})
export class AllPartnersComponent extends BasePaginatedGridComponent {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  frameworkComponents;
  partnerStates;
  clientData;
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
  rowModelType = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    public dialog: MatDialog,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    private exportService: ExportService
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.PARTNERS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        minWidth: 90,
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
        headerName: 'Partners.SiteUrl',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SiteUrl',
      },
      {
        headerName: 'Partners.AdminSiteUrl',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AdminSiteUrl',
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        cellRenderer: (params: { value: any; }) => {
          const stateId = params.value;
          const stateObject = this.partnerStates?.find((state: { Id: any; }) => state.Id === stateId);
          if (stateObject) {
            return stateObject.Name;
          }
          return 'State Unknown';
        },
        filter: 'agSetColumnFilter',
        filterParams: {
          values: this.partnerStates?.map((item: { Id: any; }) => item.Id),
          debounceMs: 200,
          suppressFilterButton: true,
          valueFormatter: (
            params: ValueFormatterParams
          ) => params.value = this.partnerStates?.find((item: { Id: any; }) => item.Id == params.value)?.Name,
        },
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        cellRenderer: function (params: { data: { CreationTime: any; }; }) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },

      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        cellRenderer: function (params: { data: { LastUpdateTime: any; }; }) {
          let datePipe = new DatePipe('en-US');
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
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'partner');
          data.queryParams = { partnerId: params.data.Id, partnerName: params.data.Name };
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
    super.ngOnInit();
    this.gridStateName = 'partners-grid-state';
    this.getPartnerStates();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
  }

  getSelectedRows(): void {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
  }

  getRows() {
    const paging = new Paging();
    paging.SkipCount = this.paginationPage - 1;
    paging.TakeCount = 5000;
    this.clientData = paging;
    this.apiService.apiPost(this.configService.getApiUrl, paging,
      true, Controllers.PARTNER, Methods.GET_PARTNERS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          const mappedRows = data.ResponseObject.Entities;
          this.rowData = mappedRows;
        }
      });
  }

  private getPartnerStates() {
    this.apiService.apiPost(this.configService.getApiUrl, null, true,
      Controllers.ENUMERATION, Methods.GET_PARTNER_STATES).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.partnerStates = data.ResponseObject;
          this.getRows();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async createPartner() {
    const { CreatePartnerComponent } = await import('../../partners/create-partner/create-partner.component');
    const dialogRef = this.dialog.open(CreatePartnerComponent, { width: ModalSizes.LARGE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getRows();
    })
  }

  exportToCsv() {
    this.exportService.exportToCsv(Controllers.PARTNER, Methods.EXPORT_PARTNERS_MODEL, { ...this.clientData, adminMenuId: this.adminMenuId });
  }

}
