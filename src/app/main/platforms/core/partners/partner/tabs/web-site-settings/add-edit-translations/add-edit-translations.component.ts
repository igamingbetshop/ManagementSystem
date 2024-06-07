import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {Controllers, Methods, ModalSizes} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-edit-translations',
  templateUrl: './add-edit-translations.component.html',
  styleUrls: ['./add-edit-translations.component.scss']
})
export class AddEditTranslationsComponent implements OnInit {
  public menuItem;
  public menuItemId;
  public items;
  public currentItem;
  public translations = [];
  public formGroup: UntypedFormGroup;
  public partnerId;
  public openedIndex = 0;
  isSendingReqest = false;

  constructor(public dialogRef: MatDialogRef<AddEditTranslationsComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              public commonDataService: CommonDataService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.menuItem = this.data;
    this.menuItemId = this.data.Id;
    this.getTranslations();
  }

  getTranslations() {
    this.apiService.apiPost(this.configService.getApiUrl, this.menuItemId, true, Controllers.CONTENT,
      Methods.GET_ITEM_TRANSLATIONS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.items = JSON.parse(JSON.stringify(data.ResponseObject));
        this.currentItem = data.ResponseObject;
        this.translations = data.ResponseObject.Translations;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  onSubmit() {
    this.isSendingReqest = true;
    let translations = this.currentItem.Translations.map((item) => {
      item.ObjectTypeId = 62;
      item.TranslationId = this.currentItem.TranslationId;
      if(item.newText) {
        item.Text = item.newText;
      }
      return item;
    })
    let changed = [];
    for (let i = 0; i < translations.length; i++) {
      if (translations[i].Text != this.items.Translations[i].Text)
        changed.push(this.currentItem.Translations[i]);
    }
    if (changed.length === 0) {
      this.isSendingReqest = false;
      return
    } else {
      this.apiService.apiPost(this.configService.getApiUrl, changed, true, Controllers.BASE,
        Methods.SAVE_TRANSLATION_ENTRIES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
        this.isSendingReqest = false;
      });
    }

  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  async addTemplate() {
    // const {AddTemplateComponent} = await import('../add-template/add-template.component');
    // const dialogRef = this.dialog.open(AddTemplateComponent, {
    //   width: ModalSizes.MEDIUM
    // });
    // dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
    //   if (data) {
    //     this.getTranslations();
    //   }
    // });
  }

}
