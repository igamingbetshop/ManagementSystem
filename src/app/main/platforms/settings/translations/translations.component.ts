import { Component, OnInit } from '@angular/core';
import { Controllers, Methods, ModalSizes } from "../../../../core/enums";
import { take } from "rxjs/operators";
import { CoreApiService } from "../../core/services/core-api.service";
import { ConfigService } from "../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Translations } from "../models/translations";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent implements OnInit {
  partnerId;
  translations: Translations[] = [];
  translationItems: Translations[] = [];
  selectedTranslationId = null;
  selectedTranslationItemId = null;
  interfaceType: number = 1;

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.interfaceType = this.activateRoute.snapshot.data.InterfaceType;
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.getTranslations();
  }

  selectTranslation(index: number, data): void {
    this.selectedTranslationId = data.Id;
    this.getTranslationItems(this.selectedTranslationId);
  }

  selectTranslationItem(index: number, data): void {
    this.selectedTranslationItemId = data.Id;
  }

  getTranslations(): void {
    this.apiService.apiPost(this.configService.getApiUrl, this.interfaceType, true,
      Controllers.CONTENT, Methods.GET_ADMIN_TRANSLATIONS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.translations = data.ResponseObject;
          this.selectedTranslationId = !!this.selectedTranslationId ? this.selectedTranslationId : this.translations[0].Id;
          this.getTranslationItems(this.selectedTranslationId);
        }
      });
  }

  async addEditTranslation(action: string, data: Translations | {}) {
    const dialogData = { ...data };
    dialogData.action = action;
    dialogData.translationId = this.selectedTranslationId;
    dialogData.interfaceType = this.interfaceType;
    const { AddEditTranslationComponent } = await import('./add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, { width: ModalSizes.MEDIUM, data: dialogData });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (!!data) {
        this.getTranslations();
      }
    });
  }

  deleteTranslation(): void {
    this.apiService.apiPost(this.configService.getApiUrl, this.selectedTranslationId, true,
      Controllers.CONTENT, Methods.REMOVE_ADMIN_TRANSLATION).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getTranslations();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async addEditTranslationItem(action: string, data: Translations | {}) {
    const dialogData = { ...data };
    dialogData.action = action;
    dialogData.translationId = this.selectedTranslationId;
    dialogData.interfaceType = this.interfaceType;
    const { AddEditTranslationItemComponent } = await import('./add-edit-translation-item/add-edit-translation-item.component');
    const dialogRef = this.dialog.open(AddEditTranslationItemComponent, { width: ModalSizes.MEDIUM, data: dialogData });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (!!data) {
        this.getTranslationItems(this.selectedTranslationId);
      }
    });
  }

  deleteTranslationItem(): void {
    this.apiService.apiPost(this.configService.getApiUrl, this.selectedTranslationItemId, true,
      Controllers.CONTENT, Methods.REMOVE_ADMIN_TRANSLATION_ITEM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getTranslationItems(this.selectedTranslationId);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getTranslationItems(id: number): void {
    this.apiService.apiPost(this.configService.getApiUrl, id, true,
      Controllers.CONTENT, Methods.GET_ADMIN_TRANSLATION_ITEMS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.translationItems = data.ResponseObject;
        }
      });
  }

  async addEditLanguages(data: { [key: string]: any }) {
    const dialogData = { ...data };
    const { AddEditLanguagesComponent } = await import('./add-edit-languages/add-edit-languages.component');
    const dialogRef = this.dialog.open(AddEditLanguagesComponent, { width: ModalSizes.MEDIUM, data: dialogData });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (!!data) {
        this.getTranslationItems(this.selectedTranslationId);
      }
    });
  }

  uploadTranslations() {
    this.apiService.apiPost(
      this.configService.getApiUrl, this.interfaceType, true, Controllers.CONTENT, Methods.UPLOAD_ADMIN_TRANSLATIONS)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Uploaded successfully', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }
}
