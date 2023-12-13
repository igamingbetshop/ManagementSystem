import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-trigger-to-group',
  templateUrl: './add-trigger-to-group.component.html',
  styleUrls: ['./add-trigger-to-group.component.scss']
})
export class AddTriggerToGroupComponent implements OnInit {
  public commonID;
  public triggerSetting;
  public triggerGroup;
  public triggerData;

  constructor(public dialogRef: MatDialogRef<AddTriggerToGroupComponent>,
              private apiService: CoreApiService,
              private activateRoute: ActivatedRoute,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.commonID = this.activateRoute.snapshot.queryParams.commonId;
    this.triggerGroup = this.data;
    this.getTriggerSettings();
  }

  getTriggerSettings() {
    this.apiService.apiPost(this.configService.getApiUrl, {BonusId: +this.commonID, Status: 1}, true,
      Controllers.BONUS, Methods.GET_TRIGGER_SETTINGS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.triggerSetting = data.ResponseObject.Entities;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    let obj = {
      TriggerGroupId: this.triggerGroup.Id,
      TriggerSettingId: this.triggerSetting.setting,
      TriggerGroupBonusId: +this.commonID,
      Order: this.triggerSetting.Order
    }
    this.apiService.apiPost(this.configService.getApiUrl, obj, true,
      Controllers.BONUS, Methods.ADD_TRIGGER_TO_GROUP).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : 'failed', Type : "error"});
      }
    });
  }

}
