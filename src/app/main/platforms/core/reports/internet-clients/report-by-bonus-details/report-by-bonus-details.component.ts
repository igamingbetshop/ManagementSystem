import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { AgBooleanFilterComponent } from "../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../components/grid-common/checkbox-renderer.component";
import { ActivatedRoute } from "@angular/router";
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { Paging } from "../../../../../../core/models";
import { Controllers, GridMenuIds, Methods } from "../../../../../../core/enums";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { DatePipe } from "@angular/common";
import { TextEditorComponent } from "../../../../../components/grid-common/text-editor.component";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateTimeHelper } from "../../../../../../core/helpers/datetime.helper";
import { formattedNumber } from "../../../../../../core/utils";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { CLIENT_BOUNUS_STATUSES } from 'src/app/core/constantes/statuses';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import {ExportService} from "../../../services/export.service";

@Component({
  selector: 'app-report-by-bonus-details',
  templateUrl: './report-by-bonus-details.component.html',
  styleUrls: ['./report-by-bonus-details.component.scss']
})
export class ReportByBonusDetailsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public partners = [];
  public partnersOption = [];
  public partnerId;
  public filteredData;
  public masterDetail;
  public detailsInline;
  public nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
  };
  public playerCurrency;
  public selectedItem = 'today';
  public status = [];
  public campaignTypes = [
    { Name: "Cash Back", Id: 1 },
    { Name: "Affiliate", Id: 3 },
    { Name: "Signup Real", Id: 5 },
    { Name: "Campaign Wager Casino", Id: 10 },
    { Name: "Campaign Cash", Id: 11 },
    { Name: "Campaign FreeBet", Id: 12 },
    { Name: "Campaign Wager Sport", Id: 13 },
    { Name: "Campaign FreeSpin", Id: 14 },
  ];
  public clientBonusStatuses = CLIENT_BOUNUS_STATUSES;
  public frameworkComponents;
  public detailCellRendererParams: any = {
    detailGridOptions: {
      rowHeight: 47,
      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
      },
      components: this.nestedFrameworkComponents,
      columnDefs: [
        {
          headerName: 'Clients.TriggerId',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Id',
          sortable: true,
          resizable: true,
          tooltipField: 'Id',
          cellStyle: { color: '#076192' }
        },
        {
          headerName: 'Common.Name',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Name',
          sortable: true,
          resizable: true,
          tooltipField: 'Id',
        },
        {
          headerName: 'Bonuses.Description',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Description',
          sortable: true,
          resizable: true,
          tooltipField: 'Description',
        },
        {
          headerName: 'Bonuses.StartTime',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'StartTime',
          sortable: true,
          resizable: true,
          tooltipField: 'StartTime',
          cellRenderer: function (params) {
            let datePipe = new DatePipe("en-US");
            let dat = datePipe.transform(params.data.StartTime, 'medium');
            if (params.node.rowPinned) {
              return ''
            } else {
              return `${dat}`;
            }
          },
        },
        {
          headerName: 'Bonuses.FinishTime',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'FinishTime',
          sortable: true,
          resizable: true,
          tooltipField: 'FinishTime',
          cellRenderer: function (params) {
            let datePipe = new DatePipe("en-US");
            let dat = datePipe.transform(params.data.FinishTime, 'medium');
            if (params.node.rowPinned) {
              return ''
            } else {
              return `${dat}`;
            }
          },
        },
        {
          headerName: 'Clients.Amount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Amount',
          sortable: true,
          resizable: true,
          tooltipField: 'MinAmount',
        },
        {
          headerName: 'Bonuses.MinAmount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MinAmount',
          sortable: true,
          resizable: true,
          tooltipField: 'MinAmount',
        },
        {
          headerName: 'Bonuses.MaxAmount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxAmount',
          sortable: true,
          resizable: true,
          tooltipField: 'MaxAmount',
        },
        {
          headerName: 'Common.Order',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Order',
          sortable: true,
          resizable: true,
          tooltipField: 'Order',
        },
        {
          headerName: 'Bonuses.Percent',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Percent',
          sortable: true,
          resizable: true,
          tooltipField: 'Percent',
        },
        {
          headerName: 'Common.TypeName',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'TypeName',
          sortable: true,
          resizable: true,
          tooltipField: 'TypeName',
        },
        {
          headerName: 'Common.Status',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'StatusName',
          sortable: true,
          resizable: true,
          tooltipField: 'StatusName',
        },
        {
          headerName: 'Segments.BetsCount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'BetsCount',
          sortable: true,
          resizable: true,
          tooltipField: 'BetsCount',
        },

      ],
      onGridReady: params => {
      },
    },
    getDetailRowData: params => {
      if (params) {
        let addedData = {
          BonusSettingId: params.data.BonusId,
          ClientId: params.data.ClientId,
        }
        this.apiService.apiPost(this.configService.getApiUrl, addedData, true,
          Controllers.CLIENT, Methods.GET_CLIENT_TRIGGERS).pipe(take(1)).subscribe(data => {
            const nestedRowData = data.ResponseObject.Triggers.map((items) => {
              items.StatusName = this.clientTriggerStatuses.find((item => item.Id === items.Status)).Name;
              if (items.MinBetCount) {
                items.BetsCount = items.BetCount + "/" + items.MinBetCount;
              } else {
                items.BetsCount = "";
              }
              if (items.WageringAmount || items.WageringAmount == 0) {
                items.MinAmount = items.WageringAmount + "/" + items.MinAmount;
              }
              return items;
            });
            params.successCallback(nestedRowData);
          })
      }
    },
  }
  public clientTriggerStatuses = [
    { Id: 1, Name: 'NotRealised' },
    { Id: 2, Name: 'Realised' }
  ];

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private exportService:ExportService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_BOUNUSES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellRenderer: 'agGroupCellRenderer',
        filter: 'agNumberColumnFilter',
        minWidth: 130,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px', },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.partnersOption,
          suppressAndOrCondition: true,
        },
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Partners.CampaignId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusId',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.Email',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Email',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.MobileNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MobileNumber',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Dashboard.WageringTarget',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WageringTarget',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusType',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.campaignTypes,
        },
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Clients.AwardingTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AwardingTime',
        sortable: true,
        resizable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          if (params.data.AwardingTime) {
            const dateString = params.data.AwardingTime;
            const dateObject = new Date(dateString);
            if (!isNaN(dateObject.getTime())) {
              const formattedDate = dateObject.toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });
              return formattedDate;
            } else {
              return "";
            }
          } else {
            return "";
          }
        },
      },
      {
        headerName: 'Clients.CalculationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationTime',
        sortable: true,
        resizable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          if (params.data.CalculationTime) {
            const dateString = params.data.CalculationTime;
            const dateObject = new Date(dateString);
            if (!isNaN(dateObject.getTime())) {
              const formattedDate = dateObject.toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });
              return formattedDate;
            } else {
              return "";
            }
          } else {
            return "";
          }
        },
      },

      {
        headerName: 'Clients.BonusPrize',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPrize',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.TurnoverAmountLeft',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TurnoverAmountLeft',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Payments.RemainingCredit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RemainingCredit',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.FinalAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FinalAmount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.ValidUntil',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ValidUntil',
        sortable: true,
        resizable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ValidUntil, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.clientBonusStatuses,
        },
      },
    ]
    this.masterDetail = true;
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      checkBoxRenderer: CheckboxRendererComponent,
      textEditor: TextEditorComponent,
      agDropdownFilter: AgDropdownFilter,
      agDateTimeFilter: AgDateTimeFilter
    }
  }

  ngOnInit(): void {
    this.setTime();
    this.partners = this.commonDataService.partners;
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    if (event.partnerId) {
      this.partnerId = event.partnerId;
    } else {
      this.partnerId = null;
    }
    this.getCurrentPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
    this.mapFilterOption();
  }

  mapFilterOption(): void {
    this.partnersOption.push("empty");
    this.partners.forEach(field => {
      this.partnersOption.push({
        displayKey: field.Id,
        displayName: field.Name,
        predicate: (_,) => false,
        numberOfInputs: 0,
      });
    })
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }
        this.changeFilerName(params.request.filterModel,
          ['Status'], ['Statuse'])
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params, ['PartnerId']);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_BONUS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities
              mappedRows.forEach((items) => {
                items['Status'] = this.clientBonusStatuses.find((state) => state.Id == items.Status)?.Name;
                items['PartnerId'] = this.partners.find((state) => state.Id == items.PartnerId)?.Name
                items['BonusType'] = this.campaignTypes.find((state) => state.Id == items.BonusType)?.Name
              })
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
              this.gridApi?.setPinnedBottomRowData([{
                BonusPrize: `${formattedNumber(data.ResponseObject.TotalBonusPrize)} ${this.playerCurrency}`,
                FinalAmount: `${formattedNumber(data.ResponseObject.TotalFinalAmount)} ${this.playerCurrency}`
              }
              ]);
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  onRowGroupOpened(params) {
    if (params.node.expanded) {
      this.gridApi.forEachNode(function (node) {
        if (node.expanded && node.id !== params.node.id && node.uiLevel === params.node.uiLevel) {
          node.setExpanded(false);
        }
      });
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.REPORT, Methods.EXPORT_REPORT_BY_BONUSES, { ...this.filteredData, adminMenuId: this.adminMenuId });
  }

}
