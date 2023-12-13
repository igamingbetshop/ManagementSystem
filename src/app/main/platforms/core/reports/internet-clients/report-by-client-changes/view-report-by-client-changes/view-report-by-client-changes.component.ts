import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, Methods} from "../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-report-by-client-changes',
  templateUrl: './view-report-by-client-changes.component.html',
  styleUrls: ['./view-report-by-client-changes.component.scss']
})
export class ViewReportByClientChangesComponent implements OnInit {
  public id;
  public filteredData;
  public fromDate = new Date();
  public toDate = new Date();
  public oldData;
  public newData;
  public statusName = [
    {Id: 1, Name: 'Active'},
    {Id: 2, Name: 'Inactive'},
    {Id: 3, Name: 'Finished'},
    {Id: 4, Name: 'Closed'},
    {Id: 5, Name: 'Waiting'},
    {Id: 6, Name: 'Lost'},
    {Id: 7, Name: 'NotAwarded'},
    {Id: 8, Name: 'Expired'}
  ];

  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              public commonDataService: CommonDataService,) {
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.toDate = new Date(this.toDate.setDate(this.toDate.getDate() + 1));
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
    data.PartnerName = this.commonDataService.partners.find((item) => {
      return item.Id === data.PartnerId;
    }).Name;
    data.GenderName = this.commonDataService.genders.find((item) => {
      return item.Id === data.Gender;
    }).Name;
    data.LanguageName = this.commonDataService.languages.find((item) => {
      return item.Id === data.LanguageId;
    }).Name;
    data.StateName = this.statusName.find((item) => {
      return item.Id === data.State;
    }).Name;
    return data;
  }

}
