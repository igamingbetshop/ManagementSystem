import {Component, Inject, NgModule, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import { CoreApiService } from '../../../services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {AddCorePromotionsComponent} from "../../core-promotions/add-core-promotions/add-core-promotions.component";
import {RouterModule} from "@angular/router";
import {AgBooleanFilterModule} from "../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";


@Component({
  selector: 'app-add-security-questions',
  templateUrl: './add-security-questions.component.html',
  styleUrls: ['./add-security-questions.component.scss']
})
export class AddSecurityQuestionsComponent implements OnInit {

  public partners: any[] = [];
  public partnerId = null;
  public formGroup: UntypedFormGroup;
  public states =  [
    {isActive: true, Name: 'Active'},
    {isActive: false, Name: 'Inactive '},
  ];

  constructor(
    public dialogRef: MatDialogRef<AddSecurityQuestionsComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
  }

  ngOnInit() {
    this.partnerId = this.data.partnerId;
    this.partners = this.commonDataService.partners;
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      NickName: [null,[Validators.required]],
      QuestionText: [null,[Validators.required]],
      Status: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.formGroup.valid){
      const requestBody = this.formGroup.getRawValue();
      this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.PARTNER,
        Methods.SAVE_SECURITY_QUESTION).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  declarations: [AddSecurityQuestionsComponent]
})

export class AddSecurityQuestionsModule {}