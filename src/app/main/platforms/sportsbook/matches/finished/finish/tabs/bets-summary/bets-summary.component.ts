import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {SportsbookApiService} from "../../../../../services/sportsbook-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {AgGridAngular} from "ag-grid-angular";
import {GridRowModelTypes} from "../../../../../../../../core/enums";
import {BasePaginatedGridComponent} from "../../../../../../../components/classes/base-paginated-grid-component";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";
import {BETAVAILABLESTATUSES, BETSTATUSES} from "../../../../../../../../core/constantes/statuses";

@Component({
  selector: 'app-bets-summary',
  templateUrl: './bets-summary.component.html',
  styleUrls: ['./bets-summary.component.scss']
})
export class BetsSummaryComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public name: string = '';
  public matchId;
  public partnerId;
  public sportId;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowData;
  public categories = [];
  public betStatuses = BETSTATUSES;
  public liveStatuses = BETAVAILABLESTATUSES;
  public marketConfig = {LiveStatus: -1};
  public filterButtons = [
    {
      Name: 'Coefficients',
      Label : 'Sport.Coefficient',
      DropdownOpened : false,
      FilterModel: {
        IsAnd: true,
        ApiOperationTypeList: [{IntValue: null, DecimalValue: null, OperationTypeId: 1}]
      }},
    {
      Name: 'BetAmounts',
      Label : 'SkillGames.BetAmount',
      DropdownOpened : false,
      FilterModel: {
        IsAnd: true,
        ApiOperationTypeList: [{IntValue: null, DecimalValue: null, OperationTypeId: 1}]
      }},
  ];

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        sortable: true,
        resizable: true,
        minWidth: 120,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.MarketName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketName',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.CoefficientAvg',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CoefficientAvg',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.SingleShareP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SingleShareP',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.SingleBetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SingleBetsCount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.SingleBetsAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SingleBetAmount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Profit',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Segments.BetsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetsCount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'SkillGames.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
    ]
  }

  ngOnInit(): void {
    this.matchId = this.activateRoute.snapshot.queryParams.finishId;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.marketConfig['MatchId'] =  this.matchId;
    this.marketConfig['PartnerId'] = this.partnerId;
    this.getCategories();
    this.getMarketBets();
  }

  getCategories() {
    const path = 'players/categories';
    this.apiService.apiPost(path, {})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.categories = data.Categories;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  getMarketBets() {
    const path = 'report/marketbets';
    this.apiService.apiPost(path, this.marketConfig)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.Objects;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  selectCategories(playerCategoryIds:  number[]): void {
    this.marketConfig['PlayerCategoryIds'] = playerCategoryIds;
    if(playerCategoryIds.length === 0) {
      delete this.marketConfig['PlayerCategoryIds'];
    }
  }

  selectStatuses(Statuses: number[]): void {
    this.marketConfig['Statuses'] = Statuses;
    if(Statuses.length === 0) {
      delete this.marketConfig['Statuses'];
    }
  }

  handleFilterOperation(operationData, filter) {
    filter.DropdownOpened = false;

    if(operationData.ApiOperationTypeList.length === 0) {
      filter.HighlightIcon = false;
      filter.FilterModel = {IsAnd: true, ApiOperationTypeList: [{IntValue: null, DecimalValue: null, OperationTypeId: 1}]}
      delete this.marketConfig[filter.Name];
    } else {
      filter.FilterModel = operationData;
      filter.HighlightIcon = true;
      this.marketConfig[filter.Name] = operationData;
    }
  }


}
