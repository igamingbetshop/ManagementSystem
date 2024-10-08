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
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-upload-html-translation',
    templateUrl: './upload-html.component.html',
    styleUrls: ['./upload-html.component.scss'],
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
        MatSelectModule
    ]
})

export class UploadHtmlComponent implements OnInit {
  partnerId: any;
  isSelectedLanguage = false
  deviceTypeId: number | null = null;
  translationData: any = {
    Language: '',
    Text: '',
    newText: ''
  };
  unModifiedData: any = {
    Text: ''
  };
  availableLanguages: any[] = [];
  selectedLanguage: string = '';

  isSendingRequest = false;

  constructor(
    public dialogRef: MatDialogRef<UploadHtmlComponent>,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.getLanguages();
  }

  getLanguages() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.LANGUAGE, Methods.GET_PARTNER_LANGUAGE_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.availableLanguages = [...data.ResponseObject.partnerLanguages];
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onLanguageChange(language: string) {
    this.selectedLanguage = language;
    this.selectedLanguage ? this.isSelectedLanguage = true : this.isSelectedLanguage = false;
  }

  close() {
    this.dialogRef.close();
  }

  onDeviceTypeChange(event: any) {
    this.deviceTypeId = event;
  }

  onSubmit() {
    if (this.translationData.newText) {
      this.translationData.Text = this.translationData.newText
        .replace(/\n/g, '') 
        .replace(/\s{2,}/g, ' ')
        .replace(/\>\s+\</g, '><') 
        .trim();
    }  
    if (this.translationData.Text !== this.unModifiedData.Text.trim()) {
      const trimmedText = this.translationData.Text.trim();
      const data = {
        languageId: this.selectedLanguage,
        contendData: trimmedText
      };
  
     
      this.dialogRef.close(data); 
    }
  }
  
  
  
}