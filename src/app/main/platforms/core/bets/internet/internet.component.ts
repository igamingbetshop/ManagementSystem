import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import { take } from 'rxjs/operators';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import 'ag-grid-enterprise';

import { CommonDataService } from 'src/app/core/services/common-data.service';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { Paging } from 'src/app/core/models';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { LocalStorageService } from "../../../../../core/services";
import { OddsTypePipe } from "../../../../../core/pipes/odds-type.pipe";
import { Controllers, Methods, OddsTypes, ModalSizes, ObjectTypes, GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { formattedNumber } from "../../../../../core/utils";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { ExportService } from "../../services/export.service";

@Component({
  selector: 'app-internet',
  templateUrl: './internet.component.html',
  styleUrls: ['./internet.component.scss']
})
export class InternetComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  DetailRowData = [];
  nestedFrameworkComponents = {
    numericEditor: NumericEditorComponent,
    textEditor: TextEditorComponent,
  }
  rowClassRules;

  deviceTypes = [];
  documentStates = [];
  clientCategories = [];
  betTypes = [];

  show = false;
  partners: any[] = [];
  partnerId = null;
  Currency;
  totalBetAmount;
  TotalWinAmount;
  TotalProfit;
  private detailGridParams: any;
  selectedItem = 'today';
  fromDate = new Date();
  toDate = new Date();
  clientData = {};
  private oddsType: number;
  private stateFilters = [];
  private selectedRowId: number;
  isResendDisabled = true;
  isSettleDisabled = true;
  private firstApiCall = true;
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  totalProfit: any;
  nestedColumnDefs = [];

  detailCellRendererParams: any = {
    detailGridOptions: {
      rowHeight: 47,
      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
      },
      components: this.nestedFrameworkComponents,
      columnDefs: this.nestedColumnDefs,
    },

    getDetailRowData: params => {
      if (params && params.data.ProductName == 'Sportsbook') {
        this.setSportsbookColumnDefs();
      }

      if (params && params.data.ProviderName == "Evolution") {
        this.setEvalutionColumnDefs();
      }

      if (params &&  params?.data.ProductName == "pregame") {
        this.setBGGamesColdefs();
      }

      if ((params?.data?.ProductName == 'Sportsbook') || (params?.data?.ProviderName == "Evolution") || (params?.data.ProductName == "pregame")) {
        const row = params.data;
        this.apiService.apiPost(this.configService.getApiUrl, row.BetDocumentId,
          true, Controllers.REPORT, Methods.GET_BET_INFO)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.DetailRowData = data.ResponseObject;
              params.data.HelpData = this.DetailRowData ? data.ResponseObject : null;
              params.data.DealerId = data.ResponseObject?.DealerId;
              params.data.DealerName = data.ResponseObject?.DealerName;
              params.data.TableID = data.ResponseObject?.TableID;
              params.data.TableName = data.ResponseObject?.TableName;
              params.data.RoundId = data.ResponseObject?.RoundId;
              params.data.RoundDuration = data.ResponseObject?.RoundDuration;
              params.data.RoundDateTime = data.ResponseObject?.RoundDateTime;
              params.data._Result = data.ResponseObject?.Result;
              if (params.data._isUpdated != true) {
                this.gridApi.redrawRows({ rowNodes: [params.node] });
              }
              params.data._isUpdated = true;
              if (params && params.data.ProductName == 'Sportsbook') {
                params.successCallback(data.ResponseObject?.BetSelections);
              } else if (params && params.data.ProviderName == "Evolution") {
                let result: any = [];
                if (data.ResponseObject) {
                  result = data.ResponseObject?.Results?.Participants[0][0]?.bets;
                }
                params.successCallback(result);
              } else if (params?.data.ProductName == "pregame") {
                params.successCallback(data.ResponseObject?.events);
              }

            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
              params.successCallback(undefined);
            }
          });
      }
    },
    refreshStrategy: 'everything',
    template: params => {
      if (!this.detailGridParams || this.detailGridParams.data.BetDocumentId != params.data.BetDocumentId) {
        this.detailGridParams = params;
      }

      const isEmpty = !params.data.HelpData ? "flex" : "none";
      const hasData = !!params.data.HelpData ? "block" : "none";
      const isSportsbook = params.data.ProductName == 'Sportsbook' ? "block" : "none";
      const isEvolution = params.data.ProviderName == 'Evolution' ? "block" : "none";

      const amount = params.data.HelpData?.BetAmount ? params.data.HelpData.BetAmount.toFixed(2) : '';
      const betDate = params.data.HelpData?.BetDate ? params.data.HelpData?.BetDate : '';
      const coefficient = params.data.HelpData?.Coefficient ? params.data.HelpData?.Coefficient : '';

      const dealerId = params.data.DealerId ? params.data.DealerId : '';
      const dealerName = params.data.DealerName ? params.data.DealerName : '';
      const TableID = params.data.TableID ? params.data.TableID : '';
      const TableName = params.data.TableName ? params.data.TableName : '';
      const roundId = params.data.RoundId ? params.data.RoundId : '';
      const roundDuration = params.data.RoundDuration ? params.data.RoundDuration : '';
      const roundDateTime = params.data.RoundDateTime ? params.data.RoundDateTime : '';
      const _Info = params.data?.HelpData?.Results?.Info ? JSON.stringify(params.data?.HelpData?.Results?.Info, null, 4) : '';
      let info = '';
      if (_Info) {
        info = _Info.replace(/{|}/g, '')
      }

      return `
        <div style="height: 100%; background-color: #EDF6FF; padding: 20px; box-sizing: border-box; overflow-y: auto">
          <div style="display: ${isEmpty}; height: 10%; color: #000; margin-bottom: 15px; justify-content: center; font-weight: 700; font-size: 24px">No information</div>
          <div style="height: 100%; display: ${hasData}">
            <div style="font-weight: 700; font-size: 24px; margin-bottom: 8px">Information</div>
            <div style="height: 10%; display: ${isSportsbook}; font-size: 16px; color: #076192">Amount: ${amount}</div>
            <div style="height: 10%; display: ${isSportsbook}; font-size: 16px; color: #076192">Bet Date: ${betDate}</div>
            <div style="height: 10%; display: ${isSportsbook}; font-size: 16px; color: #076192">Coefficient: ${coefficient}</div>

            <div style="display: ${isEvolution}">
              <div style="height: 10%; font-size: 16px; color: #076192">Dealer Id: ${dealerId}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Dealer Name: ${dealerName}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Table Id: ${TableID}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Table Name: ${TableName}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Round Id: ${roundId}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Round Duration: ${roundDuration}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Round Date Time: ${roundDateTime}</div>
              <div style="height: 10%; font-size: 16px; color: #076192">Info: ${info}</div>
            </div>

            <div style="height: 100%;">
              <div style="height: 10%; color: #000; margin-bottom: 15px; display: flex; justify-content: center; font-weight: 700; font-size: 24px">Selections</div>
              <div ref="eDetailGrid" style="height: 85%; "></div>
            </div
          </div>
        </div>`
    }
  };

  constructor(
    protected injector: Injector,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    public dateAdapter: DateAdapter<Date>,
    private localStorageService: LocalStorageService,
    private exportService: ExportService
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.INTERNET;
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDocumentId',
        resizable: true,
        sortable: true,
        minWidth: 120,
        cellRenderer: 'agGroupCellRenderer',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
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
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientUserName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        cellStyle: { cursor: 'pointer' },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        onCellClicked: (event: CellClickedEvent) => this.goToClient(event),
      },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: (params) => {
          if (params.node.rowPinned) {
            return '';
          }
          const note = `<mat-icon data-action-type="view-note" class="mat-icon material-icons" style="font-size: 18px; width: 18px; height: 20px; vertical-align: middle"> ${params.data.ClientHasNote ? 'folder' : 'folder_open'}</mat-icon>`;
          const names = `<span data-action-type="view-name">${params.data.ClientFirstName} ${params.data.ClientLastName}</span>`;
          return `${note} ${names}`;
        },
        cellStyle: { cursor: 'pointer', 'text-decoration': 'underline' },
      },
      {
        headerName: 'Clients.ProductId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProductId',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        sortable: true,
      },
      {
        headerName: 'Name',
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
        headerName: 'Providers.SubProviderName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SubproviderName',
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
        }
      },
      {
        headerName: 'Common.Round',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RoundId',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Device',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DeviceTypeId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.ClientCategory',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientCategoryId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.ClientIp',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientIp',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.Country',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Country',
        sortable: 'Country',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.stateFilters,
          suppressAndOrCondition: true,
        }
      },
      {
        headerName: 'Clients.BetType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetTypeId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Common.PossibleWin',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PossibleWin',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Win Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.BetDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetDate',
        sortable: true,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          if (params.node.rowPinned) {
            return '';
          }
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.BetDate, 'medium');
          return `${dat}`;
        },
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Profit',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.Rake',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Rake',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.BonusId',
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
        headerName: 'Bonuses.BonusAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusAmount',
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
        headerName: 'Bonuses.OriginalBonusAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OriginalBonusAmount',
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
        headerName: 'Clients.BonusWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusWinAmount',
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
        headerName: 'Clients.OriginalBonusWinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OriginalBonusWinAmount',
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
        headerName: 'Clients.Notes',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        minWidth: 140,
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
    this.rowClassRules = {
      'bets-status-2': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === "Won" || numSickDays === "Approved" || numSickDays === "Cashouted";
      },
      'bets-status-1': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 'Lost';
      },
      'bets-status-3': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 'Deleted';
      },
    };
  }

  ngOnInit() {
    this.setTime();
    this.gridStateName = 'internet-grid-state';
    this.partners = this.commonDataService.partners;
    this.clientCategories = this.activateRoute.snapshot.data.clientCategories;
    this.Currency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
    this.getDeviceTypes();
    this.getDocumentState();
    this.getBetTypes();
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

  getDeviceTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_DEVICE_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.deviceTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getDocumentState() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_DOCUMENT_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.documentStates = data.ResponseObject;
          this.mapStateFilters();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getBetTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_CREDIT_DOCUMENT_TYPES_ENUME)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.betTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });      //GET_CREDIT_DOCUMENT_TYPES_ENUME
        }
      });
  }

  mapStateFilters(): void {
    this.stateFilters.push("empty");
    this.documentStates.forEach(field => {
      this.stateFilters.push({
        displayKey: field.Id,
        displayName: field.Name,
        predicate: (_,) => false,
        numberOfInputs: 0,
      });
    })
  }

  goToClient(event) {
    const rowData = event.data;
    const url = this.router.navigate(['main/platform/clients/all-clients/client/main'],
      { queryParams: { "clientId": rowData.ClientId } });
  }

  showHide() {
    this.show = !this.show;
  }


  handleClientDate() {
    if (this.partnerId) {
      this.clientData = {
        CreatedFrom: this.fromDate,
        CreatedBefore: new Date(this.toDate.setDate(this.toDate.getDate() + 1)),
        PartnerId: this.partnerId
      };
    } else {
      this.clientData = {
        CreatedFrom: this.fromDate,
        CreatedBefore: new Date(this.toDate.setDate(this.toDate.getDate() + 1))
      };
    }
  }

  go() {
    this.getCurrentPage();
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

  async addNotes(params) {
    const { AddNoteComponent } = await import('../../../../components/add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { ObjectId: params.BetDocumentId, ObjectTypeId: ObjectTypes.Document }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.go();
      }
    });
  }

  async openNotes(dataId: number, ObjectType: number) {
    const { ViewNoteComponent } = await import('../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { ObjectId: dataId, ObjectTypeId: ObjectType, Type: 1 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(() => { });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        let paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.PartnerId = this.partnerId;
        paging.BetDateFrom = this.fromDate;
        paging.BetDateBefore = this.toDate;
        this.clientData = paging;
        if (window['searchData']) {
          paging = this.getQuickFindData(paging);
        }
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params, ['State']);
        this.changeFilerName(params.request.filterModel, ['ClientUserName'], ['UserName']);
        this.setFilter(params.request.filterModel, paging);

        this.getInternetBets(paging, params);
      },
    };
  }

  getInternetBets(paging: Paging, params): void {
    this.apiService.apiPost(this.configService.getApiUrl, paging,
      true, Controllers.REPORT, Methods.GET_INTERNET_BETS_REPORT_PAGING)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          const mappedRows = data.ResponseObject.Bets.Entities.map((items) => {
            items.id = items.BetDocumentId.toString();
            items.Id = items.BetDocumentId;
            items.StateId = items.State;
            items.UserName = items.ClientUserName;
            try {
              items.BetInfo = JSON.parse(items.BetInfo);
            } catch (e) {

            }
            return items;
          });
          mappedRows.forEach((payment) => {
            payment['DeviceTypeId'] = this.deviceTypes.find((item) => item.Id == payment.DeviceTypeId)?.Name;
            payment['ClientCategoryId'] = this.clientCategories.find((item) => item.Id == payment.ClientCategoryId)?.Name;
            payment['State'] = this.documentStates.find((item) => item.Id == payment.State)?.Name;
            payment['BetTypeId'] = this.betTypes.find((item) => item.Id == payment.BetTypeId)?.Name;
          })

          this.totalBetAmount = data.ResponseObject.TotalBetAmount;
          this.TotalWinAmount = data.ResponseObject.TotalWinAmount;
          this.TotalProfit = data.ResponseObject.TotalPossibleWinAmount;
          this.totalProfit = data.ResponseObject.TotalProfit;

          this.gridApi?.setPinnedBottomRowData([{
            PossibleWin: `${formattedNumber(this.TotalProfit)} ${this.Currency}`,
            BetAmount: `${formattedNumber(this.totalBetAmount)}  ${this.Currency}`,
            WinAmount: `${formattedNumber(this.TotalWinAmount)} ${this.Currency}`,
            Profit: `${formattedNumber(this.totalProfit)} ${this.Currency}`,
          }
          ]);
          params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Bets.Count });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          params.success({ rowData: [], rowCount: 0 });
          this.gridApi?.setPinnedBottomRowData([{
            PossibleWin: 0,
            BetAmount: 0,
            WinAmount: 0,
          }
          ]);
        }

        if (this.firstApiCall) {
          this.firstApiCall = false;
        }
      });
  }

  getQuickFindData(paging: Paging): Paging {
    const searchData = window['searchData'];
    paging.Ids = {
      IsAnd: true,
      ApiOperationTypeList: [{
        OperationTypeId: 1,
        IntValue: Number(searchData.value)
      }]
    }
    paging.BetDateFrom = new Date('1975,1,1 0:0:0');
    window['searchData'] = '';
    this.selectedItem = '';
    return paging;
  }

  public onRowClicked(event) {
    if (event.event.target !== undefined) {
      const data = event.data;
      const actionType = event.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "add":
          return this.addNotes(data);
        case "view":
          return this.openNotes(data.Id, ObjectTypes.Document);
        case "view-name":
          return this.goToClient(event);
        case "view-note":
          return this.openNotes(data.ClientId, ObjectTypes.Client);
      }
    }
  }

  onRowSelected(params) {
    const selectedRow = params.api.getSelectedRows()[0];
    this.selectedRowId = selectedRow.Id;
    const ClientUserName = selectedRow.ClientUserName.toLowerCase();
    this.isResendDisabled = !ClientUserName.startsWith('external') || selectedRow.StateId == 1;
    this.isSettleDisabled = selectedRow.StateId != 1;
  }

  resendBet() {
    this.apiService.apiPost(this.configService.getApiUrl, this.selectedRowId, true,
      Controllers.REPORT, Methods.RESEND_BET).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async settleBet() {
    const { SettleBetModalComponent } = await import('./settle-bet-modal/settle-bet-modal.component');
    const dialogRef = this.dialog.open(SettleBetModalComponent, {
      width: ModalSizes.LARGE,
      data: this.selectedRowId
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        let rowNode = this.agGrid.api.getRowNode(data.BetDocumentId.toString())!;
        const State = this.documentStates.find((item) => item.Id == data.State)?.Name;
        const newData = { ...rowNode.data, State, WinAmount: data.WinAmount };
        rowNode.setData(newData);
        this.gridApi.refreshCells({ rowNodes: [rowNode] });
      }
    });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => {
      this.gridApi.refreshServerSide({ purge: true });
    }, 100);
  }

  exportToCsv() {
    this.exportService.exportToCsv(Controllers.REPORT, Methods.EXPORT_INTERNET_BET, { ...this.clientData, adminMenuId: this.adminMenuId });
  }

  get isRowSelected() {
    return this.agGrid?.api && this.agGrid.api.getSelectedRows().length > 0;
  }

  setEvalutionColumnDefs() {
    this.nestedColumnDefs.length = 0;
    this.nestedColumnDefs.push({
      headerName: 'Payments.TransactionId',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'transactionId',
      resizable: true,
      filter: false,
    },
      {
        headerName: 'Common.Code',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'code',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.Stake',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'stake',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Payout',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'payout',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.PlacedOn',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'placedOn',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Bonuses.Description',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'description',
        resizable: true,
        filter: false,
      },);
  }

  setSportsbookColumnDefs() {
    this.nestedColumnDefs.length = 0;
    this.nestedColumnDefs.push({
      headerName: 'Common.EventDate',
      field: 'EventDate',
      filter: 'agDateColumnFilter',
      resizable: true,
      cellRenderer: function (params) {
        if (params.node.rowPinned) {
          return '';
        }
        let datePipe = new DatePipe("en-US");
        let dat = datePipe.transform(params.data.EventDate, 'medium');
        return `${dat}`;
      },
    },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.MarketName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'VirtualGames.RoundId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RoundId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Segments.SelectionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.SelectionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.UnitName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UnitName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        resizable: true,
        filter: false,
        cellRenderer: (params) => {
          const oddsTypePipe = new OddsTypePipe();
          let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
          return `${data}`;
        }
      },
      {
        headerName: 'Sport.MatchState',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsLive',
        resizable: true,
        filter: false,
        cellRenderer: params => {
          let isLiv = params.data.IsLive;
          let show = isLiv ? 'Live' : 'Prematch';
          return `${show}`;
        }
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        filter: false,
      },
    )
  }

  setBGGamesColdefs() {
    this.nestedColumnDefs.length = 0;
    this.nestedColumnDefs.push({
      headerName: 'Common.Name',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'name',
      resizable: true,
      filter: false,
    },
      {
        headerName: 'Common.SelName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'selName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.OddName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'oddName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.OddValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'oddValue',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.EventTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'extra.eventTime',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.EventScore',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'extra.eventScore',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Bonuses.TimeAddedToBetslip',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'extra.timeAddedToBetslip',
        resizable: true,
        filter: false,
      }
    );
  }
}
