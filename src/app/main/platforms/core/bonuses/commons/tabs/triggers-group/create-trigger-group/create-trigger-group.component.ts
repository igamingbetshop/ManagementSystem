import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-trigger-group',
  templateUrl: './create-trigger-group.component.html',
  styleUrls: ['./create-trigger-group.component.scss']
})
export class CreateTriggerGroupComponent implements OnInit {
  public commonID;
  public types = [
    {Id: 1, Name: 'All'},
    {Id: 2, Name: 'Any'}
  ];
  public triggerSetting;
  public formGroup: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<CreateTriggerGroupComponent>,
              private apiService: CoreApiService,
              private activateRoute: ActivatedRoute,
              public configService: ConfigService,
              private _snackBar: MatSnackBar,
              private fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.commonID = this.activateRoute.snapshot.queryParams.commonId;
    this.formValues();
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.BONUS,
      Methods.SAVE_TRIGGER_GROUP).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  formValues() {
    this.formGroup = this.fb.group({
      Type: [null],
      Name: [null],
      BonusId: +this.commonID,
      Priority: [null]
    })
  }

}
