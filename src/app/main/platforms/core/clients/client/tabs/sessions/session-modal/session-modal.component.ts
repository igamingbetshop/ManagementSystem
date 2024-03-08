import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Controllers, Methods } from 'src/app/core/enums';
import { ConfigService } from 'src/app/core/services';
import { MatSnackBar, } from "@angular/material/snack-bar";
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.scss']
})
export class SessionModalComponent implements OnInit {

  private sessionStates;
  private logOutType;
  public displayedColumns: string[] = ['Id', 'ProductId', 'State', 'LogoutDescription', 'StartTime', 'EndTime'];
  public dataSource = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number, clientId: number, sessionStates, logOutType },
    public dialogRef: MatDialogRef<SessionModalComponent>,
    public apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
  ) {

  }

  ngOnInit() {


    this.sessionStates = this.data.sessionStates;
    this.logOutType = this.data.logOutType;

    this.apiService
      .apiPost(
        this.configService.getApiUrl,
        this.data.id,
        true,
        Controllers.REPORT,
        Methods.GET_CLIENT_SESSION_INFO
      )
      .subscribe((data) => {
        if (data.ResponseCode === 0) {

          if(data.ResponseObject.length === 0 ) {
            SnackBarHelper.show(this._snackBar, { Description: "No Data", Type: "info" });
            this.dialogRef.close();

          }

          data.ResponseObject.forEach((info) => {
            let obj = {};

            let State = this.sessionStates.find((st) => {
              return st.Id == info.State;
            });
            if (State) {
              obj["State"] = State.Name;
            }

            let logOut = this.logOutType.find((type) => {
              return type.Id == info.LogoutType;
            });
            if (logOut) {
              obj["LogoutDescription"] = logOut.Name;
            }

            obj["Id"] = info.Id;
            obj["ProductId"] = info.ProductId;
            obj["StartTime"] = info.StartTime;
            obj["EndTime"] = info.EndTime;
            this.dataSource.push(obj);
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }

  close() {
    this.dialogRef.close();
  }

}
