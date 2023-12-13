import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {ConfigService, LocalStorageService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {MatDialog} from "@angular/material/dialog";
import {take} from "rxjs/operators";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../../../../components/grid-common/numeric-editor.component";
import {CheckboxRendererComponent} from "../../../../../../components/grid-common/checkbox-renderer.component";
import {Paging} from "../../../../../../../core/models";
import {DatePipe} from "@angular/common";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";
import {OddsTypePipe} from "../../../../../../../core/pipes/odds-type.pipe";
import {GridRowModelTypes, Controllers, Methods, OddsTypes, ModalSizes, GridMenuIds} from 'src/app/core/enums';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public clientId: number;
  public rowData = [];
  public statusNames = [];
  public statusFilterEntities = [];
  public rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  public detailsInline;
  public masterDetail;
  public filteredData;
  public nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    agDateTimeFilter: AgDateTimeFilter
  };
  public detailCellRendererParams: any;
  public totalBetAmount;
  public totalWinAmount;
  public playerCurrency;
  public selectedItem = 'today';
  private oddsType: number;
  private detailGridParams: any;
  public accounts = [];
  public accountId = null;

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
    this.adminMenuId = GridMenuIds.CLIENTS_BETS;
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
        headerName: 'Products.ProductName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductName',
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
        headerName: 'Clients.ProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
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
        headerName: 'Common.Round',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RoundId',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.Country',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Country',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
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
        headerName: 'Clients.BetType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetInfo',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'SkillGames.BetAmount',
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
        headerName: 'Coefficient',
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
          const oddsTypePipe = new OddsTypePipe();
          let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
          return `${data}`;
        }
      },
      {
        headerName: 'Common.PossibleWin',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PossibleWin',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
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
        headerName: 'Dashboard.GGR',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Profit',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.Rake',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Rake',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.BetDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDate',
        sortable: false,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.BetDate, 'medium');
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        hide: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Clients.Notes',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        minWidth: 130,
        filter: false,
        cellRenderer: params => {
          let keyData = params.data.HasNote;
          let newButton = `<button class="button-view-1" data-action-type="add">Add Note</button>`;
          let newButton2 = `<button class="button-view-2" data-action-type="add">Add</button>
                                        <button class="button-view-2" data-action-type="view">View</button>`
          if (keyData === false) {
            return newButton;
          } else if (keyData === true) {
            return newButton2;
          }
        }
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
            headerName: 'Common.EventDate',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'EventDate',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.SportName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SportName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.CompetitionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'CompetitionName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.RegionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'RegionName',
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
            headerName: 'Sport.MarketTypeId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MarketTypeId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MatchId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MatchId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.Round',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'RoundId',
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
            headerName: 'Common.SelectionName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SelectionName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Common.Unit',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'UnitName',
            sortable: true,
            resizable: true,
          },

        ],
        onGridReady: params => {
          // this.gridApi = params.api;
        },
      },
      getDetailRowData: params => {
        if (params) {
          this.apiService.apiPost(this.configService.getApiUrl, params.data.BetDocumentId, true,
            Controllers.REPORT, Methods.GET_BET_INFO).pipe(take(1)).subscribe(data => {
            const nestedRowData = data.ResponseObject.BetSelections;
            this.detailsInline = data.ResponseObject;
            params.data._Barcode = data.ResponseObject.Barcode;
            params.data._BetDate = data.ResponseObject.BetDate;
            params.data._AmountPerBet = data.ResponseObject.AmountPerBet;
            params.data._Coefficient = data.ResponseObject.Coefficient;
            params.data.HelpData = this.detailsInline ? data.ResponseObject : null;
            if (params.data._isUpdated != true) {
              this.gridApi.redrawRows({ rowNodes: [params.node] });
            }
            params.data._isUpdated = true;
            
            params.successCallback(nestedRowData);
          })
        }
      },
      refreshStrategy: 'everything',
      template: params => {
        const amount = params?.data?._AmountPerBet;
        const barcode = params?.data?._Barcode || "";
        const coefficient = params?.data?._Coefficient;
        const batDate = params?.data?._BetDate;
        return `
          <div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box; overflow-y: auto">
            <div style="font-weight: 700; font-size: 24px">Information</div>
            <div style="height: 10%; font-size: 16px; color: #076192">Amount: ${amount}</div>
            <div style="height: 10%; font-size: 16px; color: #076192">Barcode: ${barcode}</div>
            <div style="height: 10%; font-size: 16px; color: #076192">Bet Date: ${batDate}</div>
            <div style="height: 10%; font-size: 16px; color: #076192">Coefficient: ${coefficient}</div>
  
            <div style="height: 10%; margin-bottom: 15px; display: flex; justify-content: center; font-weight: 700; font-size: 24px";>Selections</div>
            <div ref="eDetailGrid" style="height: 90%;"></div>
          </div>`
      }
    }
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.getClientAccounts();
    this.startDate();
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
    this.toDate = new Date(this.toDate.setDate(this.toDate.getDate()));
    this.getDocumenStatesEnum();
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
  }

  getClientAccounts() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_ACCOUNTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.accounts = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
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

  onSelectAccountType(event) {
    this.accountId = event;
    this.getCurrentPage();
  }

  onGridReady(params) {
    syncNestedColumnReset();
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
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

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = this.cacheBlockSize;
        paging.BetDateFrom = this.fromDate;
        paging.BetDateBefore = this.toDate;
        paging.AccountId = this.accountId;
        paging.ClientIds = {
          IsAnd: true,
          ApiOperationTypeList: [{
            OperationTypeId: 1,
            IntValue: this.clientId
          }]
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params, ['State']);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_INTERNET_BETS_REPORT_PAGING).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            const mappedRows = data.ResponseObject.Bets.Entities;
            mappedRows.forEach((entity) => {
              let statusNames = this.statusNames.find((status) => {
                return status.Id == entity.State;
              })
              if (statusNames) {
                entity['State'] = statusNames.Name;
              }
            })
            this.totalBetAmount = data.ResponseObject.TotalBetAmount;
            this.totalWinAmount = data.ResponseObject.TotalWinAmount;
            params.success({rowData: mappedRows, rowCount: data.ResponseObject.Bets.Count});
            this.gridApi?.setPinnedBottomRowData([
              {
                BetAmount: `${this.totalBetAmount.toFixed(2)} ${this.playerCurrency}`,
                WinAmount: `${this.totalWinAmount.toFixed(2)} ${this.playerCurrency}`
              }
            ]);
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
        });
      }
    }
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

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "add":
          return this.addNotes(data);
        case "view":
          return this.openNotes(data);
      }
    }
  }

  async addNotes(params) {
    const {AddNoteComponent} = await import('../../../../../../components/add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: {ObjectId: params.BetDocumentId, ObjectTypeId: 12}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
      }
    });
  }

  async openNotes(params) {
    const {ViewNoteComponent} = await import('../../../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: {ObjectId: params.BetDocumentId, ObjectTypeId: 12, Type: 1}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

  startDate() {
    DateTimeHelper.startDate();
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
  }

  selectTime(time: string): void {
    DateTimeHelper.selectTime(time);
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
    this.selectedItem = time;
    this.getCurrentPage();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
  }

  onEndDateChange(event) {
    this.toDate = event.value;
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

}