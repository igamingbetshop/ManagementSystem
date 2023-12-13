import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../../../services/core-api.service";
import {ConfigService} from "../../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-product-setting',
  templateUrl: './view-product-setting.component.html',
  styleUrls: ['./view-product-setting.component.scss']
})
export class ViewProductSettingComponent implements OnInit {
  public id;
  public productSetting;
  public oldData;
  public newData;
  public statusName = [
    {Id: 1, Name: 'Active'},
    {Id: 3, Name: 'Hidden'},
    {Id: 2, Name: 'Inactive'},
  ];

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,) {
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;

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
    data.StateName = this.statusName.find((item) => {
      return item.Id === data.State;
    }).Name;
    return data;
  }

}
