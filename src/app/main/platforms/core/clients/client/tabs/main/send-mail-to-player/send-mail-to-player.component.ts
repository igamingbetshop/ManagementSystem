import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { take } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CoreApiService } from "../../../../../services/core-api.service";
import { HtmlEditorModule } from 'src/app/main/components/html-editor/html-editor.component';
import { Controllers, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from "../../../../../../../../core/services";
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

@Component({
  selector: 'app-send-mail-to-player',
  templateUrl: './send-mail-to-player.component.html',
  styleUrls: ['./send-mail-to-player.component.scss'],
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
export class SendMailToPlayerComponent implements OnInit {
  formGroup: UntypedFormGroup;
  clientId;
  method;
  filterClient;
  isSendingReqest = false;
  translationData = {
    Message: [
      {
        "Id": 4096,
        "Language": "English",
        "LanguageId": "en",
        "Text": ""
      }
    ]
  };
  openedIndex = 0;

  constructor(private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<SendMailToPlayerComponent>,
    public commonDataService: CommonDataService,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data,
    private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.formValues();
    this.method = this.data.method;
    this.filterClient = this.data.filterClient;
  }

  formValues() {
    this.formGroup = this.fb.group({
      Subject: [null, [Validators.required]],
      // Message: [null,],
      ClientId: [this.clientId],
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.formGroup.invalid || this.isSendingReqest) {
      return;
    } else {
      this.isSendingReqest = true; 
      let obj = this.formGroup.getRawValue();
      obj = { ...obj, Message: this.translationData.Message[0]['newText'] }

      if (this.filterClient) {
        delete obj.ClientId;
        obj = { ...obj, ...this.filterClient };
      }
      this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.CLIENT,
        Methods[this.method]).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.dialogRef.close(data.ResponseObject);
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
          this.isSendingReqest = false; 
        });
    }
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
