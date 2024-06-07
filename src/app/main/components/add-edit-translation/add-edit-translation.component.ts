import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { Controllers, Methods } from 'src/app/core/enums';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreApiService } from '../../platforms/core/services/core-api.service';
import { SnackBarHelper } from "../../../core/helpers/snackbar.helper";
import { HtmlEditorModule } from "../html-editor/html-editor.component";

@Component({
    selector: 'app-add-edit-translation',
    templateUrl: './add-edit-translation.component.html',
    styleUrls: ['./add-edit-translation.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        TranslateModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        HtmlEditorModule,
    ]
})
export class AddEditTranslationComponent implements OnInit {
  objectId;
  objectTypeId;
  translationData = {
    NickName: "",
    TranslationId: "",
    Translations: []
  };
  unModifiedData;
  openedIndex = 0;
  deviceTypeId: null | number;
  isSendingReqest = false; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ObjectId: any, ObjectTypeId: any, DeviceTypeId: number | null },
    public dialogRef: MatDialogRef<AddEditTranslationComponent>,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
    public commonDataService: CommonDataService,
  ) { }

  ngOnInit() {
    this.objectId = this.data.ObjectId;
    this.objectTypeId = this.data.ObjectTypeId;
    this.deviceTypeId = this.data.DeviceTypeId;    
    this.getTemplateTranslations();
  }

  public getTemplateTranslations() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      ObjectId: this.objectId,
      ObjectTypeId: this.objectTypeId || 66,
      Type: this.deviceTypeId
    },
      true, Controllers.CONTENT, Methods.GET_OBJECT_TRANSLATIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.unModifiedData = JSON.parse(JSON.stringify(data.ResponseObject));
          this.translationData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  close() {
    this.dialogRef.close();
  }

  onDeviceTypeChange(event) {
    this.deviceTypeId = event;
    this.getTemplateTranslations();
  }

  onSubmit() {
    this.translationData.Translations.forEach(translation => {
      translation.ObjectTypeId = this.objectTypeId;
      translation.TranslationId = this.translationData.TranslationId;
      if (translation.newText) {
        translation.Text = translation.newText;
      }
    });

    let changedItems = [];

    for (let i = 0; i < this.translationData.Translations.length; i++) {
      if (this.translationData.Translations[i].Text != this.unModifiedData.Translations[i].Text) {
        changedItems.push(this.translationData.Translations[i]);
      }
    }
    this.saveTranslation(changedItems);
  }

  saveTranslation(requestBody) {
    this.isSendingReqest = true; 
    if(this.data.DeviceTypeId && requestBody.length > 0) {
      requestBody.forEach(item => {
        item.Type = this.deviceTypeId;
      });      
    }
    this.apiService.apiPost(this.configService.getApiUrl, requestBody,
      true, Controllers.BASE, Methods.SAVE_TRANSLATION_ENTRIES)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false; 
      })
  }
}
