import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from '@angular/material/table';
import { Controllers, Methods } from 'src/app/core/enums';
import { ConfigService } from 'src/app/core/services';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { DEVICE_TYPES } from 'src/app/core/constantes/statuses';

interface SessionData {
  Id: number;
  ProductName: string;
  ProductId: number;
  State: string;
  LogoutDescription: string;
  Ip: string;
  StartTime: string;
  EndTime: string;
}

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.scss']
})
export class SessionModalComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'ProductName', 'ProductId', 'State', 'LogoutDescription', 'Ip', 'Country', 'DeviceType', 'StartTime', 'EndTime'];
  dataSource = new MatTableDataSource<SessionData>();
  deviceTypes = DEVICE_TYPES;
  private sessionStates;
  private logOutType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number, clientId: number, sessionStates, logOutType },
    public dialogRef: MatDialogRef<SessionModalComponent>,
    private apiService: CoreApiService,
    private configService: ConfigService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.sessionStates = this.data.sessionStates;
    this.logOutType = this.data.logOutType;


    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',  
      day: 'numeric', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      second: 'numeric',
      hour12: true 
    });

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
          if (data.ResponseObject.length === 0) {
            SnackBarHelper.show(this._snackBar, { Description: "No Data", Type: "info" });
            this.dialogRef.close();
            return;
          }

          const formattedData = data.ResponseObject.map((info) => ({
            Id: info.Id,
            ProductId: info.ProductId,
            ProductName: info.ProductName,
            State: this.sessionStates.find((st) => st.Id === info.State)?.Name || '',
            LogoutDescription: this.logOutType.find((type) => type.Id === info.LogoutType)?.Name || '',
            Ip: info.Ip,
            DeviceType: this.deviceTypes.find((type) => type.Id === info.DeviceType)?.Name || '',
            Country: info.Country,
            StartTime: dateFormatter.format(new Date(info.StartTime)),
            EndTime: dateFormatter.format(new Date(info.EndTime))
          }));

          this.dataSource.data = formattedData;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
