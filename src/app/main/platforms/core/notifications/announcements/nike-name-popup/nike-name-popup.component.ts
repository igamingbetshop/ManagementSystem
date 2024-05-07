import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreApiService } from '../../../services/core-api.service';
import { HtmlEditorModule } from 'src/app/main/components/html-editor/html-editor.component';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

@Component({
  selector: 'app-nike-name-popup',
  templateUrl: './nike-name-popup.component.html',
  styleUrls: ['./nike-name-popup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    HtmlEditorModule,
  ],
})
export class NikiNamePopup implements OnInit {
  public formGroup: UntypedFormGroup;
  public objectId;
  public objectTypeId;
  public translationData = {
    NickName: "",
    TranslationId: "",
    Translations: []
  };
  public unModifiedData;
  public openedIndex = 0;
  public newText;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ObjectId: any, ObjectTypeId: any },
    public dialogRef: MatDialogRef<NikiNamePopup>,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
    public commonDataService: CommonDataService,
  ) { }

  ngOnInit() {
    this.objectId = this.data.ObjectId;
    this.objectTypeId = this.data.ObjectTypeId;
    this.getTemplateTranslations();
  }

  public getTemplateTranslations() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      ObjectId: this.objectId,
      ObjectTypeId: this.objectTypeId || 70
    },
      true, Controllers.CONTENT, Methods.GET_OBJECT_TRANSLATIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.unModifiedData = JSON.parse(JSON.stringify(data.ResponseObject));
          this.translationData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
  }

  close() {
    this.dialogRef.close();
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
    this.apiService.apiPost(this.configService.getApiUrl, requestBody,
      true, Controllers.BASE, Methods.SAVE_TRANSLATION_ENTRIES)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close('success');
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }
}

