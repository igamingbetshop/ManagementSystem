import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Controllers, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../../services/core-api.service';
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {

  public id;
  public oldData;
  public newData;
  public partners: any [] = [];
  public productStates: any[] = [];
  public gameProviders: any[] = [];
  betId: any;
  name: any;
  productId: any;

  constructor(private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService
  ) { }

  ngOnInit() {
    this.betId = this.activateRoute.snapshot.queryParams.BetId;
    this.name = this.activateRoute.snapshot.queryParams.Name;
    this.productId = this.activateRoute.snapshot.queryParams.ProductId;
    this.id = this.activateRoute.snapshot.queryParams.CommentId;
    this.partners = this.commonDataService.partners;
    this.getProductStates();
    this.getGameProviders();
    setTimeout(() => {
      this.getObjectHistory();
    },100);

  }

  getGameProviders(){
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.PRODUCT, Methods.GET_GAME_PROVIDERS)
      .pipe(take(1))
      .subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.gameProviders = data.ResponseObject;
      } else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  getProductStates(){
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_PRODUCT_STATES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.productStates = data.ResponseObject;
      } else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });

  }

  getObjectHistory(){
    this.apiService.apiPost(this.configService.getApiUrl, this.id, true,
      Controllers.REPORT, Methods.GET_OBJECT_HISTORY_ELEMENT_BY_ID).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.oldData = this.mapData(data.ResponseObject[0]);
        this.newData = this.mapData(data.ResponseObject[1]);

      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  mapData(res) {
    let data = JSON.parse(res);
    data.StateName = this.productStates.find((item) => {
      return item.Id === data.State;
    }).Name;
    data.ProviderName = this.gameProviders.find((item) => {
      return item.Id === data.GameProviderId;
    }).Name;

    return data;
  }

}
