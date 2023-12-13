import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {VirtualGamesApiService} from "../../../../services/virtual-games-api.service";
import {take} from "rxjs/operators";
import {CommonDataService} from "../../../../../../../core/services";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public user: any;
  public userId: any;
  public path = 'user';
  public pageConfig;
  public genders: any[] = [
    {Id: 1, NickName: null, Name: "Male", Info: null},
    {Id: 2, NickName: null, Name: "Female", Info: null}
  ];

  constructor(private activateRoute: ActivatedRoute, private _snackBar: MatSnackBar,
              public apiService: VirtualGamesApiService, public commonDataService: CommonDataService) {
  }

  ngOnInit(): void {
    this.userId = +this.activateRoute.snapshot.queryParams.userId;
    this.getUser();
  }

  getUser() {
    this.pageConfig = {
      Ids: {
        IsAnd: true,
        ApiOperationTypeList: [{IntValue: this.userId, DecimalValue: this.userId, OperationTypeId: 1}],
      }
    }
    this.apiService.apiPost(this.path, this.pageConfig)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.user = data.ResponseObject.Entities[0];
          this.user.GenderName = this.genders.find(p => p.Id === this.user.Gender).Name;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

}
