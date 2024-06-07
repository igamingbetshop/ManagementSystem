import { Component, Injector, OnInit } from '@angular/core';
import { take } from "rxjs/operators";
import { AgBooleanFilterComponent } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../components/grid-common/checkbox-renderer.component";
import { BasePaginatedGridComponent } from "../../../../components/classes/base-paginated-grid-component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VirtualGamesApiService } from "../../services/virtual-games-api.service";
import { Paging } from "../../../../../core/models";
import 'ag-grid-enterprise';
import { DatePipe } from "@angular/common";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { OddsTypePipe } from "../../../../../core/pipes/odds-type.pipe";
import { LocalStorageService } from "../../../../../core/services";
import { GridMenuIds, GridRowModelTypes, OddsTypes } from 'src/app/core/enums';
import { formattedNumber } from "../../../../../core/utils";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-report-by-bet',
  templateUrl: './report-by-bet.component.html',
  styleUrls: ['./report-by-bet.component.scss']
})
export class ReportByBetComponent extends BasePaginatedGridComponent implements OnInit {
  public path: string = 'bet';
  public rowData;
  public rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  public fromDate = new Date();
  public toDate = new Date();
  public selectedData;
  public filteredData;
  public selected = false;
  public masterDetail;
  public nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
  };
  public detailCellRendererParams: any;
  public amount;
  public winAmount;
  public profit;
  public playerCurrency;
  public selectedItem = 'today';
  private oddsType: number;

  public betStatuses = [
    { "Name": "Uncalculated", Id: 1 },
    { "Name": "Won", Id: 2 },
    { "Name": "Lost", Id: 3 },
    { "Name": "Deleted", Id: 4 },
    { "Name": "CashoutedFully", Id: 5 },
    { "Name": "Returned", Id: 6 },
    { "Name": "NotAccepted", Id: 7 },
    { "Name": "CashoutedPartially", Id: 8 },
    { "Name": "Waiting", Id: 9 }
  ];

  constructor(
    protected injector: Injector, private _snackBar: MatSnackBar,
    private apiService: VirtualGamesApiService,
    public dateAdapter: DateAdapter<Date>,
    private localStorageService: LocalStorageService) {
    super(injector);
    this.adminMenuId = GridMenuIds.VG_REPORTS_BY_BETS;
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 120,
        filter: 'agNumberColumnFilter',
        cellRenderer: 'agGroupCellRenderer',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
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
        headerName: 'Partners.PartnerId',
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
        headerName: 'Partners.PlatformId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Barcode',
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
        headerName: 'SkillGames.GameId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameId',
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
        headerName: 'SkillGames.GameName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameName',
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
        headerName: 'SkillGames.UnitId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UnitId',
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
        headerName: 'Common.UnitName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UnitName',
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
        headerName: 'Common.EventDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'EventDate',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.EventDate, 'medium');
          // if (params.node.rowPinned && !params.data.EventDate) {
          if (!params.data.EventDate) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Sport.TypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
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
        headerName: 'Clients.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopId',
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
        headerName: 'Clients.BetShop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShop',
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
        headerName: 'Clients.CashierId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CashierId',
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
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: (params) => {
          if (params.node.rowPinned) {
            return '';
          }
          const oddsTypePipe = new OddsTypePipe();
          let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
          return `${data}`;
        }
      },
      {
        headerName: 'Clients.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
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
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
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
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitAmount',
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
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'statusName',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellClass: (params) => {
          if (!params.data.statusName) {
            return null;
          }
          return [params.data.statusName];
        }
      },
      {
        headerName: 'Payments.TicketNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TicketNumber',
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
        headerName: 'Common.BetDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDate',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.BetDate, 'medium');
          if (!params.data.BetDate) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Dashboard.CalculationDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationDate',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CalculationDate, 'medium');
          if (!params.data.CalculationDate) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
    ];
    this.masterDetail = true;
    this.detailCellRendererParams = {
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
            headerName: 'Common.Id',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Id',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Segments.SelectionId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SelectionId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MarketName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MarketName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.SelectionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SelectionName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'VirtualGames.RoundId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'RoundId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Clients.Amount',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Amount',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'SkillGames.UnitId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'GameUnitId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.Coefficient',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Coefficient',
            sortable: true,
            resizable: true,
            cellRenderer: (params) => {
              const oddsTypePipe = new OddsTypePipe();
              let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
              return `${data}`;
            }
          },
          {
            headerName: 'Common.Status',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Status',
            sortable: true,
            resizable: true,
          },
        ],
        onGridReady: params => {
        },
      },
      getDetailRowData: params => {
        if (params) {
          this.apiService.apiPost('bet/selections', { BetId: params.data.Id })
            .pipe(take(1))
            .subscribe((data) => {
              const nestedRowData = data.ResponseObject;
              params.successCallback(nestedRowData);
            })
        }
      },
    }
  }

  ngOnInit(): void {
    this.setTime();
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
  }

  isBetCalculated() {
    if (this.gridApi && this.gridApi?.getSelectedRows().length === 0) {
      return true;
    } else {
      return this.gridApi?.getSelectedRows()[0].Status !== 1;
    }
  };

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  deleteBet() {

    this.apiService.apiPost('bet/delete', { BetId: this.selectedData.data.Id })
      .pipe(take(1))
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'The bet has been deleted successfully', Type: "success" });
          this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onRowGroupOpened(params) {
    if (params.node.expanded) {
      this.gridApi.forEachNode(function (node) {
        if (
          node.expanded &&
          node.id !== params.node.id &&
          node.uiLevel === params.node.uiLevel
        ) {
          node.setExpanded(false);
        }
      });
    }
  }

  isRowSelected() {
    return this.gridApi && this.gridApi?.getSelectedRows().length === 0;
  };

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

  onRowSelected(params) {
    if (params.node.selected) {
      this.selectedData = params;
    }
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize)
        paging.BetDateFrom = this.fromDate;
        paging.BetDateBefore = this.toDate;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.path, this.filteredData)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.amount = data.ResponseObject.TotalBetAmount;
              this.winAmount = data.ResponseObject.TotalWinAmount;
              this.profit = data.ResponseObject.TotalProfit;
              this.gridApi?.setPinnedBottomRowData([{
                BetAmount: `${formattedNumber(this.amount)} ${this.playerCurrency}`,
                WinAmount: `${formattedNumber(this.winAmount)} ${this.playerCurrency}`,
                ProfitAmount: `${formattedNumber(this.profit)} ${this.playerCurrency}`
              }
              ]);

              const mappedData = data.ResponseObject.Entities.map(bet => {
                bet.statusName = this.betStatuses.find((status) => status.Id == bet.Status)?.Name;
                return bet;
              });

              params.success({ rowData: mappedData, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    }
  }

  calculateBet() {
    let row = this.gridApi?.getSelectedRows()[0];
    this.apiService.apiPost('bet/calculate', { BetId: row.Id })
      .pipe(take(1))
      .subscribe((data) => {
        if (data.Code === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

}
