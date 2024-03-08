import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {take} from "rxjs/operators";
import {AgGridAngular} from "ag-grid-angular";
import {AgBooleanFilterComponent} from "../../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../../../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../../../../../components/grid-common/numeric-editor.component";
import {CheckboxRendererComponent} from "../../../../../../../components/grid-common/checkbox-renderer.component";
import {BasePaginatedGridComponent} from "../../../../../../../components/classes/base-paginated-grid-component";
import {SportsbookApiService} from "../../../../../services/sportsbook-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {Paging} from "../../../../../../../../core/models";
import 'ag-grid-enterprise';
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";
import {OddsTypePipe} from "../../../../../../../../core/pipes/odds-type.pipe";
import {LocalStorageService} from "../../../../../../../../core/services";
import { OddsTypes, ModalSizes } from 'src/app/core/enums';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public path: string = 'report/bets';
  public name: string = '';
  public matchId;
  public pageConfig = {};
  public filteredData;
  public rowData;
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
  public detailsInline;
  public selectedData;
  public selected = false;
  public commentTypes;
  public rowStyle;
  private oddsType: number;
  private statusFilterArray = [];

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
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    super(injector);
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
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
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
        headerName: 'Partners.PlatformId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PlatformId',
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
        headerName: 'Sport.IsLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsLive',
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
        headerName: 'Common.Profit',
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
        headerName: 'Payments.CurrencyId',
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
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.statusFilterArray,
          suppressAndOrCondition: true,
        },
      },
      {
        headerName: 'Payments.TicketNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TicketNumber',
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
        headerName: 'Payments.SystemOutCountValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SystemOutCount',
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
          if (params.node.rowPinned) {
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
          if (params.node.rowPinned) {
            return ''
          } else {
            return `${dat}`;
          }
        },
      },
      {
        headerName: 'Common.Ip',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Ip',
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
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
    ]
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
            headerName: 'Sport.MatchId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MatchId',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MatchNumber',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MatchNumber',
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
            headerName: 'Sport.MarketId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MarketId',
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
            headerName: 'Sport.MarketId',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MarketId',
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
            headerName: 'Sport.SportName',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'SportName',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.Competitors',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'Competitors',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.IsLive',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'IsLive',
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
          {
            headerName: 'Common.EventDate',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'EventDate',
            sortable: true,
            resizable: true,
          },
          {
            headerName: 'Sport.MatchState',
            headerValueGetter: this.localizeHeader.bind(this),
            field: 'MatchState',
            sortable: true,
            resizable: true,
          },
        ],
        onGridReady: params => {
        },
      },
      getDetailRowData: params => {
        if (params) {
          this.apiService.apiPost('report/selections', {BetId: params.data.Id})
            .pipe(take(1))
            .subscribe((data) => {
              const nestedRowData = data.Selections;
              this.detailsInline = data.Selections;
              params.successCallback(nestedRowData);
            })
        }
      },
    }
    this.rowStyle = {background: 'white'};
  }

  ngOnInit() {
    this.matchId = this.activateRoute.snapshot.queryParams.MatchId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
    this.pageConfig = {
      MatchId: this.matchId
    };
    this.getCommentTypes();
    this.playerCurrency = JSON.parse(localStorage.getItem('user'))?.CurrencyId;
  }

  getRowStyle(params) {
    if (params.node.data) {
      return {'background-color': params.data.CommentTypeName};
    }
  }

  getCommentTypes() {
    this.apiService.apiPost('commenttypes', {})
      .pipe(take(1))
      .subscribe((data) => {
        if (data.Code === 0) {
          this.commentTypes = data.CommentTypes;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = this.cacheBlockSize;
        paging.MatchId = this.matchId;
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params, ['State']);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.path, this.filteredData)

          .pipe(take(1))
          .subscribe(data => {
            if (data.Code === 0) {
              const mappedRows = data.Objects.map((items) => {
                items.CommentTypeName = this.commentTypes.find((item => item.Id === items.CommentTypeId))?.Color;
                items['State'] = this.betStatuses.find((status) => status.Id == items.State)?.Name;

                return items;
              });
              this.amount = data.TotalBetAmount;
              this.winAmount = data.TotalWinAmount;
              this.profit = data.TotalProfit;
              this.gridApi?.setPinnedBottomRowData([
                {
                  BetAmount: `${this.amount.toFixed(2)} ${this.playerCurrency}`,
                  WinAmount: `${this.winAmount.toFixed(2)} ${this.playerCurrency}`,
                  ProfitAmount: `${this.profit.toFixed(2)} ${this.playerCurrency}`
                }
              ]);
              params.success({rowData: mappedRows, rowCount: data.TotalCount});
            } else {
              SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
            }
          });
      }
    }
  }

  getBets() {
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  calculateBet() {
    let row = this.gridApi?.getSelectedRows()[0];
    this.apiService.apiPost('report/calculatebet', {BetId: row.Id})
      .pipe(take(1))
      .subscribe((data) => {
        if (data.Code === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
  }

  deleteBet() {
    if (!this.selectedData) {
      this.selected = false;
    } else {
      this.apiService.apiPost('report/deletebet', {BetId: this.selectedData.data.Id})
        .pipe(take(1))
        .subscribe((data) => {
          if (data.Code === 0) {
            this.selected = false;
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
        })

    }
  }

  isBetCalculated() {
    if (this.gridApi && this.gridApi?.getSelectedRows().length === 0) {
      return true;
    } else {
      return this.gridApi?.getSelectedRows()[0].Status !== 1;
    }
  };

  onRowSelected(params) {
    if (params.node.selected) {
      this.selectedData = params;
    }
  }

  isRowSelected() {
    return this.gridApi && this.gridApi?.getSelectedRows().length === 0;
  };

  onGridReady(params) {
    super.onGridReady(params);
    this.mapStatusFilter();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  mapStatusFilter(): void {
    this.statusFilterArray.push("empty");
    this.betStatuses.forEach(field => {
      this.statusFilterArray.push({
        displayKey: field.Id,
        displayName: field.Name,
        predicate: (_,) => false,
        numberOfInputs: 0,
      });
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
    const {AddNoteComponent} = await import('../../../../../../../components/add-note/add-note.component');
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
    const {ViewNoteComponent} = await import('../../../../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: {ObjectId: params.BetDocumentId, ObjectTypeId: 12, Type: 1}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {}
    });
  }

}
