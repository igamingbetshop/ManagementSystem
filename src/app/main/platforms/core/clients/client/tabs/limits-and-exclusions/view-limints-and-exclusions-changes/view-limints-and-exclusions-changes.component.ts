import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

import {Controllers, Methods} from "../../../../../../../../core/enums";
import {CoreApiService} from "../../../../../services/core-api.service";
import {ConfigService} from "../../../../../../../../core/services";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-limints-and-exclusions-changes',
  templateUrl: './view-limints-and-exclusions-changes.component.html',
  styleUrls: ['./view-limints-and-exclusions-changes.component.scss']
})
export class ViewLimitsAndExclusionsChanges implements OnInit {
  public id;
  public clientId;
  public oldData;
  public newData;


  constructor(private activateRoute: ActivatedRoute,
              private apiService: CoreApiService,
              private router: Router,
              public configService: ConfigService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.fetchHistory();
  }

  onNavigateTo() {

    this.router.navigate(['main/platform/clients/all-clients/client/limits-and-exclusions/'],
      {queryParams: {"clientId": this.clientId}});
  }

  fetchHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, this.id, true,
      Controllers.REPORT, Methods.GET_OBJECT_HISTORY_ELEMENT_BY_ID).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.oldData = JSON.parse(data.ResponseObject[0]);
        this.newData = JSON.parse(data.ResponseObject[1]);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
