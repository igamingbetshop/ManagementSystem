import {Component, Inject, NgModule, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SkillGamesApiService} from "../../../services/skill-games-api.service";
import {CommonDataService} from "../../../../../../core/services";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatButtonModule} from "@angular/material/button";

import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {take} from "rxjs";

@Component({
  selector: 'app-add-edit-translation',
  templateUrl: './add-edit-translation.component.html',
  styleUrls: ['./add-edit-translation.component.scss']
})
export class AddEditTranslationComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public objectId;
  public objectTypeId;
  public TranslationId;
  public translationData = {
    TranslationId: "",
    NickName: "",
    TranslationEntries: []
  };
  public unModifiedData;
  isSendingReqest = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ObjectId: any, ObjectTypeId: any },
    public dialogRef: MatDialogRef<AddEditTranslationComponent>,
    private _snackBar: MatSnackBar,
    private apiService: SkillGamesApiService,
    public commonDataService: CommonDataService,
  ) {
  }

  ngOnInit() {
    this.objectId = this.data.ObjectId;
    this.objectTypeId = this.data.ObjectTypeId;
    this.getTemplateTranslations();
  }

  public getTemplateTranslations() {
    this.apiService.apiPost('translation/objecttranslations', {
        ObjectId: this.objectId,
        ObjectTypeId: this.objectTypeId || 66
      })
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.unModifiedData = JSON.parse(JSON.stringify(data.ResponseObject.Entities));
          this.translationData = data.ResponseObject.Entities;
          this.TranslationId = this.translationData.TranslationId
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    let requestBody = {
      ObjectTypeId: this.objectTypeId,
      ObjectId: this.objectId,
      TranslationId: this.TranslationId,
      TranslationEntries: []
    };
    this.isSendingReqest = true;
    for (let i = 0; i < this.translationData.TranslationEntries.length; i++) {
      if (this.translationData.TranslationEntries[i].Text != this.unModifiedData.TranslationEntries[i].Text) {
        requestBody.TranslationEntries.push(this.translationData.TranslationEntries[i]);
      }
    }

    this.saveTranslation(requestBody);
  }

  saveTranslation(requestBody) {
    this.apiService.apiPost('translation/save', requestBody)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        this.isSendingReqest = false;
      })
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  declarations: [AddEditTranslationComponent],

})
export class AddEditSkillTranslationModule {

}

