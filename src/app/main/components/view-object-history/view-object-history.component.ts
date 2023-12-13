import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Controllers, Methods } from "../../../core/enums";
import { CoreApiService } from "../../platforms/core/services/core-api.service";
import { ConfigService } from "../../../core/services";
import { SnackBarHelper } from "../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-object-history',
  templateUrl: './view-object-history.component.html',
  styleUrls: ['./view-object-history.component.scss']
})
export class ViewObjectHistoryComponent implements OnInit {
  clientId: number;
  ObjectHistory: number;
  public history = [];
  public oldData;
  public newData;
  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    protected injector: Injector,
    public configService: ConfigService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.ObjectHistory = this.activateRoute.snapshot.queryParams.ObjectHistory;
    this.apiService.apiPost(this.configService.getApiUrl, this.ObjectHistory, true,
      Controllers.REPORT, Methods.GET_OBJECT_HISTORY_ELEMENT_BY_ID).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.oldData = JSON.parse(data.ResponseObject[0]);
          this.newData = JSON.parse(data.ResponseObject[1]);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }
}
