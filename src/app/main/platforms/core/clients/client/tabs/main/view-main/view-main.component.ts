import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {CoreApiService} from "../../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-main',
  templateUrl: './view-main.component.html',
  styleUrls: ['./view-main.component.scss']
})
export class ViewMainComponent implements OnInit {
  public id;
  public oldData;
  public newData;
  public statusName;
  public regions = [];

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService) {
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.statusName = this.activateRoute.snapshot.data.clientStates;
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
    if (data.DocumentType) {
      data.documentTypeName = this.commonDataService.documentTypes.find((item) => {
        return item.Id === data.DocumentType;
      }).Name;
    }
    data.PartnerName = this.commonDataService.partners.find((item) => {
      return item.Id === data.PartnerId;
    }).Name;
    data.GenderName = this.commonDataService?.genders?.find((item) => {
      return item.Id === data.Gender;
    })?.Name;
    data.LanguageName = this.commonDataService.languages.find((item) => {
      return item.Id === data.LanguageId;
    }).Name;
    data.StateName = this.statusName.find((item) => {
      return item.Id === data.State;
    }).Name;
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe((data1) => {
      if (data1.ResponseCode === 0) {
        data.RegionName = data1.ResponseObject.find((item) => {
          return item.Id === data.RegionId;
        }).Name;
      }
    });
    return data;
  }

}
