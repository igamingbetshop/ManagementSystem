import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CoreApiService } from "../../../../../services/core-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonDataService, ConfigService } from "../../../../../../../../core/services";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Controllers, Methods } from "../../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-edit-menu-item',
  templateUrl: './add-edit-menu-item.component.html',
  styleUrls: ['./add-edit-menu-item.component.scss']
})
export class AddEditMenuItemComponent implements OnInit {
  action;
  partnerId;
  menuItem;
  formGroup: UntypedFormGroup;
  validDocumentSize;
  validDocumentFormat;
  checkDocumentSize;
  iconChanging;
  showFile = false;
  selectedImage;
  selectedHoverImage;
  isSendingReqest = false;

  constructor(public dialogRef: MatDialogRef<AddEditMenuItemComponent>,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.action = this.data.action;
    this.menuItem = this.data;
    this.formValues();
    if (this.menuItem.Icon) {
      this.showFile = true;
    }
  }

  private formValues() {
    if (this.action === 'Add') {
      this.formGroup = this.fb.group({
        Title: [null],
        Type: [null],
        StyleType: [''],
        Icon: [''],
        Href: [null],
        Order: [null],
        OpenInRouting: [false],
        MenuId: [this.menuItem.MenuId],
        Orientation: [false],
        Image: [null],
        HoverImage: [null]
      })
    } else if (this.action === 'Edit') {
      this.formGroup = this.fb.group({
        Id: [this.menuItem.Id],
        Title: [this.menuItem.Title],
        Type: [this.menuItem.Type],
        StyleType: [this.menuItem.StyleType],
        Icon: [this.menuItem.Icon],
        Href: [this.menuItem.Href],
        Order: [this.menuItem.Order],
        OpenInRouting: [this.menuItem.OpenInRouting],
        MenuId: [this.menuItem.MenuId],
        Orientation: [this.menuItem.Orientation],
        Image: [null],
        HoverImage: [null]
      })
    }
  }

  submit() {
    this.isSendingReqest = true;
    const value = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.CONTENT,
      Methods.SAVE_WEBSITE_MENU_ITEM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

  uploadFile(event) {
    let files = event.target.files.length && event.target.files[0];
    if (files) {
      this.validDocumentSize = files.size < 900000;
      this.validDocumentFormat = files.type === 'image/png' ||
        files.type === 'image/jpg' || files.type === 'image/jpeg' || files.type === 'image/gif' || files.type === 'image/svg+xml';
      if ((files.size < 900000) &&
        (files.type === 'image/png' || files.type === 'image/jpg' || files.type === 'image/jpeg' || files.type === 'image/gif' || files.type === 'image/svg+xml')) {
        this.checkDocumentSize = true;
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;
          this.formGroup.get('Image').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
          this.formGroup.get('Icon').setValue(files.name);
          this.selectedImage = files.name;

        };
        reader.readAsDataURL(files);
      } else {
        this.checkDocumentSize = false;
        files = null;
        SnackBarHelper.show(this._snackBar, { Description: 'failed', Type: "error" });
      }
    }
  }

  uploadHoverImage(event: any): void {
    const files = event.target.files && event.target.files[0];
    if (files) {
      const validDocumentSize = files.size < 5000000;
      const validDocumentFormat = /\.(jpg|jpeg|png|gif|svg|txt|xml|json)$/i.test(files.name);
      if (validDocumentFormat && validDocumentSize) {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;
          this.formGroup.get('HoverImage').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
          // this.formGroup.get('Icon').setValue(files.name);
          this.selectedHoverImage = files.name;
        };
        reader.readAsDataURL(files);
      } else {
        this.formGroup.get('HoverImage').patchValue(null);
        SnackBarHelper.show(this._snackBar, { Description: 'Not valid format jpg, png, or Gif and size < 700KB', Type: 'error' });
      }
    }
  }


  changeIcon(event) {
    this.iconChanging = event.target.value;
    if (this.iconChanging || this.formGroup.get('Icon').value) {
      this.showFile = true
    } else {
      this.showFile = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
