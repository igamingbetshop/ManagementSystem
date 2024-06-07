import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { MatDialog } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import { DateAdapter } from "@angular/material/core";
import { GridRowModelTypes, Controllers, Methods } from 'src/app/core/enums';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { Paging } from 'src/app/core/models';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { ConfigService, LocalStorageService } from 'src/app/core/services';

@Component({
  selector: 'app-popup-statistics',
  templateUrl: './popup-statistics.component.html',
  styleUrls: ['./popup-statistics.component.scss']
})
export class PopupStatisticsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  id: number;
  rowData = [];
  statusNames = [];
  statusFilterEntities = [];
  // rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  fromDate = new Date();
  toDate = new Date();
  clientData = {};
  detailsInline;
  masterDetail;
  filteredData;
  nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    agDateTimeFilter: AgDateTimeFilter
  };

  isRowMaster;
  detailCellRendererParams: any;
  totalBetAmount;
  totalWinAmount;
  playerCurrency;
  selectedItem = 'today';
  private oddsType: number;
  accountId = null;
  providers = [];
  pageIdName: string;

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public dateAdapter: DateAdapter<Date>,
    private localStorageService: LocalStorageService) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDocumentId',
        sortable: true,
        resizable: true,
        cellRenderer: 'agGroupCellRenderer',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Products.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        sortable: true,
        resizable: true,
        // TODO
        // filter: 'agTextColumnFilter',
        // filterParams: {
        //   buttons: ['apply', 'reset'],
        //   closeOnApply: true,
        //   filterOptions: this.filterService.textOptions
        // }
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
        // TODO
      },
      {
        headerName: 'Common.DeviceType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DeviceType',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.statusFilterEntities
        },

      },
      {
        headerName: 'Clients.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'SkillGames.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
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
        headerName: 'LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.ViewTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ViewTypeId',
        sortable: false,
        resizable: true,
      },
      {
        headerName: 'Common.ViewCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ViewCount',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
    ];

  }

  ngOnInit(): void {
    this.id = +this.activateRoute.snapshot.queryParams.id;
    this.setTime();
    this.pageIdName = `/ ${this.id} : ${this.translate.instant('Clients.Bets')}`;
    this.toDate = new Date(this.toDate.setDate(this.toDate.getDate()));
    this.getDocumenStatesEnum();
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.getRows();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.getCurrentPage();
  }

  getDocumenStatesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_DOCUMENT_STATES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.statusNames = data.ResponseObject;
          this.mapStatusFilter();
        }
      });
  }


  mapStatusFilter(): void {
    this.statusFilterEntities.push("Select State");
    this.statusNames.forEach(field => {
      this.statusFilterEntities.push({
        displayKey: field.Id,
        displayName: field.Name,
        predicate: (_,) => false,
        numberOfInputs: 0,
      });
    })
  }

      getRows () {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = this.cacheBlockSize;
        paging.PopupId = this.id;
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_POPUP_STATISTICS).pipe(take(1)).subscribe((data) => {
            if (data.ResponseCode === 0) {
              console.log(data, "DATA");
              
              const mappedRows = data.ResponseObject.Bets.Entities;
              mappedRows.forEach((entity) => {
                let statusNames = this.statusNames.find((status) => {
                  return status.Id == entity.State;
                })
                if (statusNames) {
                  entity['State'] = statusNames.Name;
                }
                if (entity.ProviderName !== "SoftGaming") {
                  entity.masterDetail = true;
                } else {
                  entity.masterDetail = false;
                }
              })
              this.totalBetAmount = data.ResponseObject.TotalBetAmount;
              this.totalWinAmount = data.ResponseObject.TotalWinAmount;
              this.gridApi?.setPinnedBottomRowData([
                {
                  BetAmount: `${this.totalBetAmount.toLocaleString('en-US', { maximumFractionDigits: 2 }).replace(/,/g, ' ')} ${this.playerCurrency}`,
                  WinAmount: `${this.totalWinAmount.toLocaleString('en-US', { maximumFractionDigits: 2 }).replace(/,/g, ' ')} ${this.playerCurrency}`
                }
              ]);

              this.isRowMaster = (dataItem: any) => {
                return this.providers.includes(dataItem.ProductId);
              };

            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
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
  }

  onNavigateToClient() {
    this.router.navigate(["/main/platform/clients/all-clients"])
  }

}
