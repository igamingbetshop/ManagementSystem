import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {SportsbookApiService} from '../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import {AgGridAngular} from 'ag-grid-angular';
import {Paging} from 'src/app/core/models';
import {take} from 'rxjs/operators';
import {DatePipe, DecimalPipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {CellClickedEvent} from 'ag-grid-community';
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { AVAILABLEBETCATEGORIES, BETAVAILABLESTATUSES } from 'src/app/core/constantes/statuses';
import { GridMenuIds } from 'src/app/core/enums';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

//import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-by-bets-not-accepted',
  templateUrl: './by-bets-not-accepted.component.html',
  styleUrls: ['./by-bets-not-accepted.component.scss']
})
export class ByBetsNotAcceptedComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;


  public availableStatuses = BETAVAILABLESTATUSES;

  public availableBetCategories = AVAILABLEBETCATEGORIES;

  public betStatuses = [
    {"Name": this.translate.instant('Sport.Uncalculated'), Id: 1},
    {"Name": this.translate.instant('Sport.Won'), Id: 2},
    {"Name": this.translate.instant('Sport.Lost'), Id: 3},
    {"Name": this.translate.instant('Sport.Deleted'), Id: 4},
    {"Name": this.translate.instant('Sport.CashoutedFully'), Id: 5},
    {"Name": this.translate.instant('Sport.Returned'), Id: 6},
    {"Name": this.translate.instant('Sport.NotAccepted'), Id: 7},
    {"Name": this.translate.instant('Sport.CashoutedPartially'), Id: 8},
    {"Name": this.translate.instant('Sport.Waiting'), Id: 9}
  ];


  public betTypesModel = [
    {"Name": this.translate.instant('Sport.Single'), "Id": 1},
    {"Name": this.translate.instant('Sport.Multiple'), "Id": 2},
    {"Name": this.translate.instant('Sport.System'), "Id": 3},
    {"Name": this.translate.instant('Sport.Chain'), "Id": 4}
  ];

  public commentTypes: any[] = [];
  public selectedItem = 'today';

  public availableBetCategoriesStatus: number = -1;
  public availableStatusesStatus: number = -1;
  public show = true;
  public fromDate = new Date();
  public toDate = new Date();

  public rowData = [];

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
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px',},
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
        cellStyle: {'text-decoration': 'underline', 'cursor ': 'pointer'},
        onCellClicked: (event: CellClickedEvent) => this.goToPlayer(event),
      },

      {
        headerName: 'Partners.PlatformId',
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
        cellStyle: {'text-decoration': 'underline', 'cursor ': 'pointer'},
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
    this.startDate();
    this.gridStateName = 'report-by-bet-not-accepted-grid-state';
    this.getCommentTypes();
  }

  // isRowSelected() {
  //   return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length > 0;
  // };


  getCommentTypes() {
    this.apiService.apiPost('commenttypes').subscribe(data => {
      if (data.Code === 0) {
        this.commentTypes = data.CommentTypes;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }

    })
  }

  goToPlayer(ev) {
    const row = ev.data;
    const url = this.router.serializeUrl(this.router.createUrlTree(['main/sportsbook/players/player/main'],
      {queryParams: {"playerId": row.PlayerId,}}));
    window.open(url, '_blank');
  }

  goToMatch(ev) {
    const row = ev.data;
    const url = this.router.serializeUrl(this.router.createUrlTree(['main/sportsbook/matches/active-matches/active/main'],
      {queryParams: {"partnerId": row.PartnerId, "MatchId": row.MatchId, 'name': row.Competitors,}}));
    window.open(url, '_blank');
  }


  // async addNotes(params) {
  //   const {SbAddNoteComponent} = await import('../../../../../components/sb-add-bet-shop-note/sb-add-bet-shop-note.component');
  //   const dialogRef = this.dialog.open(SbAddNoteComponent, {
  //     width: ModalSizes.MEDIUM,
  //     data: {CommentTypes: this.commentTypes, BetId: params.Id}
  //   });
  //   dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
  //     if (data) {
  //       this.getCurrentPage();
  //     }
  //   });
  // }

  // async openNotes(params) {
  //   const {SbViewNoteComponent} = await import('../../../../../components/sb-view-note/sb-view-note.component');
  //   const dialogRef = this.dialog.open(SbViewNoteComponent, {
  //     width: ModalSizes.EXTRA_LARGE,
  //     data: {CommentTypes: this.commentTypes, BetId: params.Id}
  //   });
  //   dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
  //     if (data) {
  //     }
  //   });
  // }

  // public onRowClicked(e) {
  //   let row = e.data;

  //   this.apiService.apiPost('report/selections',{BetId: row.Id})
  //   .pipe(take(1))
  //   .subscribe(data => {
  //     if(data.Code === 0){
  //       for (var i = 0; i < data.Selections.length; i++) {
  //         data.Selections[i].Competitors = data.Selections[i].Competitors.join('-');
  //         data.Selections[i].ResettleStatus = data.Selections[i].SelectionStatus;
  //     }
  //       this.rowData1 = data.Selections;

  //       this.rowData1.forEach(match => {
  //         let statusName = this.betStatuses.find((status) => {
  //           return status.Id == match.SelectionStatus;
  //         })
  //         if(statusName){
  //           match['StatusName'] = statusName.Name;
  //         }
  //       })
  //       row.SystemOutCountValue = row.SystemOutCount === null ? '' : row.SystemOutCount + '/' + data.Selections.length;
  //     }else{
  //       this._snackBar.open(data.Description, null, { duration: 3000 });
  //     }

  //   })

  //   if (e.event.target !== undefined) {
  //     let data = e.data;
  //     let actionType = e.event.target.getAttribute("data-action-type");

  //     switch (actionType) {
  //       case "add-bet-shop":
  //         return this.addNotes(data);
  //       case "view":
  //         return this.openNotes(data);
  //     }
  //   }
  // }

  go() {
    this.getCurrentPage();
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

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
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

        this.apiService.apiPost('report/notacceptedbets', paging,
        ).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {

            const mappedRows = data.Objects;

            mappedRows.forEach((bet) => {

              let betTypeName = this.betTypesModel.find((betType) => {
                return betType.Id == bet.TypeId;
              })
              if (betTypeName) {
                bet['TypeName'] = betTypeName.Name;
              }
              let statusName = this.betStatuses.find((status) => {
                return status.Id == bet.Status;
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
            params.success({rowData: mappedRows, rowCount: data.TotalCount});
          } else {
            SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
          }
        });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }
}
