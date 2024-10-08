import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { formatDateTime } from 'src/app/core/utils';

@Component({
  selector: 'app-view-report-by-bet-shop-game',
  templateUrl: './view-report-by-bet-shop-game.component.html',
  styleUrls: ['./view-report-by-bet-shop-game.component.scss']
})
export class ViewReportByBetShopGameComponent implements OnInit {
  public id;
  fromDate: any;
  public toDate: any;

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,
              protected injector: Injector) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.setTime();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = formatDateTime(fromDate);
    this.toDate = formatDateTime(toDate);    
  }

}
