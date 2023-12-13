import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CoreApiService} from "../../../../../services/core-api.service";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public clientId;
  public notificationTypes = [
    {Id: 1, Name: 'Send Via Email'},
    {Id: 2, Name: 'Send Via Mobile'},
  ]

  constructor(private fb: UntypedFormBuilder,
              public dialogRef: MatDialogRef<ChangePasswordComponent>,
              public commonDataService: CommonDataService,
              private configService: ConfigService,
              private _snackBar: MatSnackBar,
              private apiService: CoreApiService,
              private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.formValues();
  }

  formValues() {
    this.formGroup = this.fb.group({
      NotificationType: [1],
      Comment: [null],
      ClientId: [this.clientId],
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    } else {
      const obj = this.formGroup.getRawValue();
      this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.CLIENT,
        Methods.RESET_CLIENT_PASSWORD).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
    }
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
