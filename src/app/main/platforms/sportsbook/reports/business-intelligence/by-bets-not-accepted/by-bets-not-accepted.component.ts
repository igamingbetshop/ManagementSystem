import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import { Paging } from 'src/app/core/models';
import { take } from 'rxjs/operators';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent } from 'ag-grid-community';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { AVAILABLEBETCATEGORIES, BETAVAILABLESTATUSES, BETSTATUSES } from 'src/app/core/constantes/statuses';
import { GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-by-bets-not-accepted',
  templateUrl: './by-bets-not-accepted.component.html',
  styleUrls: ['./by-bets-not-accepted.component.scss']
})
export class ByBetsNotAcceptedComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;


  public availableStatuses = BETAVAILABLESTATUSES;

  public availableBetCategories = AVAILABLEBETCATEGORIES;

  public betStatuses = BETSTATUSES;

  public betTypesModel = [
    { "Name": this.translate.instant('Sport.Single'), "Id": 1 },
    { "Name": this.translate.instant('Sport.Multiple'), "Id": 2 },
    { "Name": this.translate.instant('Sport.System'), "Id": 3 },
    { "Name": this.translate.instant('Sport.Chain'), "Id": 4 },
    { "Name": this.translate.instant('Sport.Teaser'), "Id": 5 }
  ];

  public commentTypes: any[] = [];
  public selectedItem = 'today';

  public availableBetCategoriesStatus: number = -1;
  public availableStatusesStatus: number = -1;
  public show = true;
  public fromDate = new Date();
  public toDate = new Date();
  public filteredData: any;
  public rowData = [];
  rowData1: any;
  betsCount: any;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>
    //public router: ActivatedRoute,
  ) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.adminMenuId = GridMenuIds.SP_REPORT_BY_NOT_ACCEPTED_BETS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
        minWidth: 80,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px', },
        filter: 'agNumberColumnFilter',
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
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.PlayerCategoryId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PlayerCategoryId',
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
        headerName: 'SkillGames.PlayerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        minWidth: 80,
        cellStyle: { 'text-decoration': 'underline', 'cursor ': 'pointer' },
        onCellClicked: (event: CellClickedEvent) => this.goToPlayer(event),
      },

      {
        headerName: 'Common.ErrorMessages',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalBetId',
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
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.TypeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.BetShopId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShopId',
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
        headerName: 'Clients.BetShop',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetShop',
        resizable: true,
        sortable: true,
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
        headerName: 'Sport.IsLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsLive',
        resizable: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.Coefficient, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'SkillGames.BetAmount',
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
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.BetAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Common.WinAmount',
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
        cellRenderer: function (params) {
          let numberPipe = new DecimalPipe("en-US");
          let data = numberPipe.transform(params.data.WinAmount, '1.2-2');
          return `${data}`;
        }
      },
      {
        headerName: 'Sport.ProfitAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitAmount',
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
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        resizable: true,
        sortable: true,
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
        field: 'StatusName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Payments.TicketNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TicketNumber',
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
        headerName: 'Common.CommentTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CommentTypeId',
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
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        minWidth: 80,
        cellStyle: { 'text-decoration': 'underline', 'cursor ': 'pointer' },
        onCellClicked: (event: CellClickedEvent) => this.goToMatch(event),
      },
      {
        headerName: 'Sport.Competitors',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Competitors',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.SportId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
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
        headerName: 'Sport.Sport',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        resizable: true,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
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
        headerName: 'Sport.Competition',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        resizable: true,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
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
        headerName: 'Sport.MarketName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketName',
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

      // {
      //   headerNaCommon.me: 'Notes',
      // headerValueGetter: this.localizeHeader.bind(this),
      //   resizable: true,
      //   sortable: false,
      //   minWidth: 140,
      //   filter: false,
      //   cellRenderer: params => {
      //     let keyData = params.data.HasNote;
      //     let newButton = `<button class="button-view-1" data-action-type="add-bet-shop">Add Note</button>`;
      //     let newButton2 = `<button class="button-view-2" data-action-type="add-bet-shop">Add</button>
      //        <button class="button-view-2" data-action-type="view">View</button>`
      //     if (keyData === false) {
      //       return newButton;
      //     } else if (keyData === true) {
      //       return newButton2;
      //     }
      //   }
      // }
    ];


  }

  ngOnInit() {
    this.gridStateName = 'report-by-bet-not-accepted-grid-state';
    this.getCommentTypes();
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

  onSelectBetCategory(event) {
    this.availableBetCategoriesStatus = event;
    this.getCurrentPage();
  }

  onSelectBetStatus(event) {
    this.availableStatusesStatus = event;
    this.getCurrentPage();
  }

  getCommentTypes() {
    this.apiService.apiPost('commenttypes').subscribe(data => {
      if (data.Code === 0) {
        this.commentTypes = data.CommentTypes;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }

    })
  }

  goToPlayer(ev) {
    const row = ev.data;
    const url = this.router.serializeUrl(this.router.createUrlTree(['main/sportsbook/players/player/main'],
      { queryParams: { "playerId": row.PlayerId, } }));
    window.open(url, '_blank');
  }

  goToMatch(ev) {
    const row = ev.data;
    const url = this.router.serializeUrl(this.router.createUrlTree(['/main/sportsbook/matches/active-matches/all-active/active/main'],
      { queryParams: { "partnerId": row.PartnerId, "MatchId": row.MatchId, 'name': row.Competitors, } }));
    window.open(url, '_blank');
  }

  go() {
    this.getCurrentPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
    syncColumnSelectPanel();
    syncColumnReset();
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.LiveStatus = this.availableStatusesStatus;
        paging.BetCategory = this.availableBetCategoriesStatus;

        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        delete paging.StartDate;
        delete paging.EndDate;

        this.filteredData = paging;

        this.apiService.apiPost('report/notacceptedbets', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {

            const mappedRows = data.Objects;
            this.rowData1 = [];
            mappedRows.forEach((bet) => {

              let betTypeName = this.betTypesModel.find((betType) => {
                return betType.Id == bet.TypeId;
              })
              if (betTypeName) {
                bet['TypeName'] = betTypeName.Name;
              }
              let statusName = this.betStatuses.find((status) => {
                return status.Id == bet.State;
              })
              if (statusName) {
                bet['StatusName'] = statusName.Name;
              }

              let typeColor = this.commentTypes.find((com) => {
                return com.Id == bet.CommentTypeId;
              })
              if (typeColor) {
                bet['CommentTypeColor'] = typeColor.Color;
              }

              let typeName = this.commentTypes.find((com) => {
                return com.Id == bet.CommentTypeId;
              })
              if (typeName) {
                bet['CommentTypeName'] = typeColor.Name;
              }

              bet.SystemOutCountValue = bet.SystemOutCount === null ? '' : bet.SystemOutCount + '/...';

              bet['Competitors'] = bet['Competitors'].join("-");
            })
            if (!!mappedRows.length) {
              this.onRowClicked(mappedRows[0]);
              setTimeout(() => {
                this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
              }, 0)
            }
            params.success({ rowData: mappedRows, rowCount: data.TotalCount });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      },
    };
  }

  exportToCsv() {
    this.apiService.apiPost('report/exportnotacceptedbets', { ...this.filteredData, adminMenuId: this.adminMenuId }).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  public onRowClicked(event) {

    console.log(event, "EV");

    this.show = true;
    let row = event;
    this.apiService.apiPost('report/selections', { BetId: row.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData1 = data.Selections;
          this.rowData1.forEach(match => {
            if (match.ForcedChosen) {
              this.betsCount++;
            }
            match['StatusName'] = this.betStatuses.find((status) => status.Id == match.SelectionStatus)?.Name;
          })
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  goToFinishedMatchesMarket(ev) {
    const row = ev.data;
    let filter = {
      matchId: row.MatchId,
      PartnerId: 0
    }
    this.apiService.apiPost('matches/match', filter)
      .pipe(take(1))
      .subscribe(data => {
        let res = data.ResponseObject;

        if (res.Status == 1 || res.Status == 0) {
          const url = this.router.serializeUrl(this.router.createUrlTree(['main/sportsbook/matches/active-matches/all-active/active/markets'],
            {
              queryParams: {
                "partnerId": 0,
                "MatchId": row.MatchId,
                'number': row.MatchNumber,
                'name': row.SportName,
                'sportId': row.SportId
              }
            }));
          window.open(url, '_blank');
        } else {
          const url = this.router.serializeUrl(this.router.createUrlTree(['/main/sportsbook/matches/finished/finish/markets'],
            {
              queryParams: {
                "partnerId": 0,
                "finishId": row.MatchId,
                'number': row.MatchNumber,
                'name': row.SportName,
              }
            }));
          window.open(url, '_blank');
        }
      })
  }
}
