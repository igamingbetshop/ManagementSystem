import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import { PoolBettingApiService } from 'src/app/main/platforms/sportsbook/services/pool-betting-api.service';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { PBControllers, PBMethods } from 'src/app/core/enums';

@Component({
  selector: 'app-add-edit-menu',
  templateUrl: './add-edit-menu.component.html',
  styleUrls: ['./add-edit-menu.component.scss']
})
export class AddEditMenuComponent implements OnInit {
  public action;
  public partnerId;
  public menuItem;
  public formGroup: UntypedFormGroup;
  public validDocumentSize;
  public validDocumentFormat;
  public checkDocumentSize;
  public iconChanging;
  public showFile = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditMenuComponent>,
    private apiService: PoolBettingApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
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
        Type: [''],
        StyleType: [''],
        Icon: [''],
        Href: [null],
        Order: [null],
        OpenInRouting: [false],
        MenuId: [this.menuItem.MenuId],
        Orientation: [false],
        Image: [null],
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
      })
    }
  }

  changeIcon(event) {
    this.iconChanging = event.target.value;
    this.showFile = !!this.iconChanging;
  }

  submit() {
    const value = this.formGroup.getRawValue();
    this.apiService.apiPost(PBControllers.PARTNERS, PBMethods.SAVE_WEBSITE_MENU_ITEM, value)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  uploadFile(event) {
    let files = event.target.files.length && event.target.files[0];
    if (files) {
      this.validDocumentSize = files.size < 900000;
      this.validDocumentFormat = files.type === 'image/png' ||
        files.type === 'image/jpg' || files.type === 'image/jpeg' || files.type === 'image/gif';
      if ((files.size < 900000) &&
        (files.type === 'image/png' || files.type === 'image/jpg' || files.type === 'image/jpeg' || files.type === 'image/gif')) {
        this.checkDocumentSize = true;
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;
          this.formGroup.get('Image').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
          this.formGroup.get('Icon').setValue(files.name);
        };
        reader.readAsDataURL(files);
      } else {
        this.checkDocumentSize = false;
        files = null;
        SnackBarHelper.show(this._snackBar, { Description: 'failed', Type: "error" });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
