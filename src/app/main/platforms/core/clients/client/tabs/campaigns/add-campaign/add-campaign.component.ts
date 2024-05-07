import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.scss']
})
export class AddCampaignComponent implements OnInit {
  campaigns = [];
  campaignTypes = [
    { Name: "Cash Back", Id: 1 },
    { Name: "Affiliate", Id: 3 },
    { Name: "Signup Real", Id: 5 },
    { Name: "Campaign Wager Casino", Id: 10 },
    { Name: "Campaign Cash", Id: 11 },
    { Name: "Campaign FreeBet", Id: 12 },
    { Name: "Campaign Wager Sport", Id: 13 },
    { Name: "Campaign FreeSpin", Id: 14 },
  ];
  isSendingReqest = false;
  clientId: number;
  formGroup: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<AddCampaignComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.formValues();
  }

  formValues() {
    this.formGroup = this.fb.group({
      ClientId: [this.clientId],
      BonusSettingId: [null, [Validators.required]],
    });
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  changeType(type) {
    let obj = {
      ClientId: this.clientId,
      IsActive: true,
      Type: type
    }
    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.BONUS,
      Methods.GET_AVAILABLE_BOUNUS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.campaigns = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  submit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.isSendingReqest = true; 
    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.CLIENT,
      Methods.GIVE_BONUS_TO_CLIENT).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingReqest = false; 
    });

  }


}
