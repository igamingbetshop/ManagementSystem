import {Component, Inject, OnInit} from '@angular/core';
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";
import {VirtualGamesApiService} from "../../../../../services/virtual-games-api.service";

@Component({
  selector: 'app-add-key',
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss']
})
export class AddKeyComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public partnerId;

  constructor(
    public dialogRef: MatDialogRef<AddKeyComponent>,
    private apiService: VirtualGamesApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.formValues();
  }

  private formValues() {
    this.formGroup = this.fb.group({
      Name: [null],
      NumericValue: [null],
      StringValue: [null],
    })
  }

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }
    const requestBody = this.formGroup.getRawValue();
    requestBody.PartnerId = +this.partnerId;
    this.apiService.apiPost('partners/savepartnerkey', requestBody).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close('success');
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
