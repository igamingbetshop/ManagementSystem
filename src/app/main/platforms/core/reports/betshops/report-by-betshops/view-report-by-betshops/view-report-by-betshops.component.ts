import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CoreApiService } from "../../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { Paging } from 'src/app/core/models';
import { take } from 'rxjs';
import { Controllers, GridRowModelTypes, Methods } from 'src/app/core/enums';

@Component({
  selector: 'app-view-report-by-betshops',
  templateUrl: './view-report-by-betshops.component.html',
  styleUrls: ['./view-report-by-betshops.component.scss']
})
export class ViewReportByBetshopsComponent extends BasePaginatedGridComponent implements OnInit {
  public betShopId;
  public rowData = [];
  public fromDate;
  public toDate;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;


  constructor(private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector) {
    super(injector)
    this.columnDefs = [
      {
        headerName: 'SkillGames.GameId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameId',
      },
      {
        headerName: 'SkillGames.GameName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameName',
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameId',
      },
      {
        headerName: 'SkillGames.BetAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetAmount',
      },
      {
        headerName: 'Common.WinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinAmount',
      },
      {
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Profit',
      },
      {
        headerName: 'Sport.ProfitPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitPercent',
      },
    ]
  }

  ngOnInit(): void {
    this.betShopId = this.activateRoute.snapshot.params.id;
    this.toDate = new Date(this.activateRoute.snapshot.queryParams.toDate);
    this.fromDate = new Date(this.activateRoute.snapshot.queryParams.fromDate);
    this.featchData();
  }

  featchData() {
    const paging = new Paging();
    paging.BetDateBefore = this.toDate;
    paging.BetDateFrom = this.fromDate;
    paging.SkipCount = this.paginationPage - 1;
    paging.TakeCount = Number(this.cacheBlockSize);
    paging.BetShopIds = { IsAnd: true, ApiOperationTypeList: [{ IntValue: this.betShopId, OperationTypeId: 1 }] }

    this.apiService.apiPost(this.configService.getApiUrl, paging, true,
      Controllers.REPORT, Methods.GET_REPORT_BY_BET_SHOP_GAMES).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.Entities;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
