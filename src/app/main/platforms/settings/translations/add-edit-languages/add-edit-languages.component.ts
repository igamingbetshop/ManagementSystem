import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs/operators";
import {CoreApiService} from "../../../core/services/core-api.service";
import {ConfigService} from "../../../../../core/services";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {Controllers, Methods} from "../../../../../core/enums";

@Component({
  selector: 'app-add-edit-languages',
  templateUrl: './add-edit-languages.component.html',
  styleUrls: ['./add-edit-languages.component.scss']
})
export class AddEditLanguagesComponent implements OnInit {
  translationItemId;
  private translationId;
  originTranslations;
  translations = [];
  partnerId;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditLanguagesComponent>,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.translationItemId = this.data.Id;
    this.getAdminTranslations();
  }

  getAdminTranslations() {
    this.apiService.apiPost(this.configService.getApiUrl, this.translationItemId, true, Controllers.CONTENT,
      Methods.GET_ADMIN_ITEM_TRANSLATIONS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.originTranslations = JSON.parse(JSON.stringify(data.ResponseObject));
        this.translationId = data.ResponseObject.TranslationId;
        this.translations = data.ResponseObject.Translations;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  onSubmit() {
    let translations = this.getMappedTranslations();
    let changed = this.getChangetTranslations(translations);
    if (changed.length === 0) {
      return;
    } else {
      this.isSendingReqest = true;
      this.apiService.apiPost(this.configService.getApiUrl, changed, true, Controllers.BASE,
        Methods.SAVE_TRANSLATION_ENTRIES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        this.isSendingReqest = false;
      });
    }
  }

  getMappedTranslations() {
    return this.translations.map((field) => {
      field.ObjectTypeId = 62;
      field.TranslationId = this.translationId;
      return field;
    })
  }

  getChangetTranslations(translations) {
    const changed = [];

    for (let i = 0; i < translations.length; i++) {
      if (translations[i].Text != this.originTranslations.Translations[i].Text)
        changed.push(this.translations[i]);
    }

    return changed;
  }

  close() {
    this.dialogRef.close();
  }
}
