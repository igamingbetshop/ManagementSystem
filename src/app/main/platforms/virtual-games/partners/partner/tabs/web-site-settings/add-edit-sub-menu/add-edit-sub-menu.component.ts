import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VirtualGamesApiService} from "../../../../../services/virtual-games-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs/operators";
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

@Component({
  selector: 'app-add-edit-sub-menu',
  templateUrl: './add-edit-sub-menu.component.html',
  styleUrls: ['./add-edit-sub-menu.component.scss']
})
export class AddEditSubMenuComponent implements OnInit {
  action;
  partnerId;
  menuItem;
  formGroup: UntypedFormGroup;
  iconChanging;
  showFile = false;
  selectedImage;
  validDocumentSize;
  validDocumentFormat;
  checkDocumentSize;

  constructor(public dialogRef: MatDialogRef<AddEditSubMenuComponent>,
              public apiService: VirtualGamesApiService,
              private _snackBar: MatSnackBar,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.action = this.data.action;
    this.menuItem = this.data;
    this.formValues();
  }

  private formValues() {
    if (this.action === 'Add') {
      this.formGroup = this.fb.group({
        Title: [null],
        Type: [''],
        Icon: [''],
        Href: [null],
        Order: [null],
        OpenInRouting: [false],
        MenuItemId: [this.menuItem.MenuItemId],
        IsColor: [false],
        Image: [null],
      })
    } else if (this.action === 'Edit') {
      this.formGroup = this.fb.group({
        Id: [this.menuItem.Id],
        Title: [this.menuItem.Title],
        Type: [this.menuItem.Type],
        Icon: [this.menuItem.Icon],
        Href: [this.menuItem.Href],
        Order: [this.menuItem.Order],
        OpenInRouting: [this.menuItem.OpenInRouting],
        MenuItemId: [this.menuItem.MenuItemId],
        IsColor: [false],
        Image: [null],
      })
    }
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  submit() {
    const value = this.formGroup.getRawValue();
    this.apiService.apiPost('cms/savewebsitesubmenuitem', value)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      });
  }

  changeIcon(event) {
    this.iconChanging = event.target.value;
    if (this.iconChanging || this.formGroup.get('Icon').value) {
      this.showFile = true
    } else {
      this.showFile = false;
    }
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

}
