import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CoreApiService} from '../../../../../services/core-api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommonDataService, ConfigService} from '../../../../../../../../core/services';
import {ActivatedRoute} from '@angular/router';
import {Controllers, Methods} from '../../../../../../../../core/enums';
import {take} from 'rxjs/operators';
import {SnackBarHelper} from '../../../../../../../../core/helpers/snackbar.helper';

@Component({
  selector: 'app-add-edit-sub-menu',
  templateUrl: './add-edit-sub-menu.component.html',
  styleUrls: ['./add-edit-sub-menu.component.scss']
})
export class AddEditSubMenuComponent implements OnInit {
  public action;
  public partnerId;
  public menuItem;
  public formGroup: UntypedFormGroup;
  public checkDocumentSize;
  public iconChanging;
  public showFile = false;
  public color = '';
  public styleMenuId = 43;

  constructor(
    public dialogRef: MatDialogRef<AddEditSubMenuComponent>,
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
        Type: [''],
        StyleType: [''],
        Icon: [''],
        Href: [null],
        Order: [null],
        OpenInRouting: [false],
        MenuItemId: [this.menuItem.MenuItemId],
        IsColor: [false],
        Image: [null],
      });
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
        MenuItemId: [this.menuItem.MenuItemId],
        IsColor: [false],
        Image: [null],
      });
      this.color = this.menuItem.Type;
    }
  }

  onSubmit() {
    const requestBody = this.formGroup.getRawValue();

    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.CONTENT,
      Methods.SAVE_WEBSITE_SUB_MENU_ITEM).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: 'error'});
      }
    });
  }

  uploadFile(event) {

    let files = event.target.files.length && event.target.files[0];
    if (files) {
      if (this.isValidFormat(files)) {
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
        SnackBarHelper.show(this._snackBar, {Description: 'file format not valid', Type: 'error'});
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  changeIcon(event) {
    this.iconChanging = event.target.value;
    if (this.iconChanging || this.formGroup.get('Icon').value) {
      this.showFile = true;
    } else {
      this.showFile = false;
    }
  }

  isValidFormat(files: any): boolean {
    return (files.size < 700000) && (files.type === 'image/png' ||
      files.type === 'image/jpg' ||
      files.type === 'image/x-icon' ||
      files.type === 'image/svg+xml' ||
      files.type === 'image/jpeg' ||
      files.type === 'image/gif' ||
      files.name.includes('.ttf'));
  }


  public onChangeColor(color: string): void {
    this.color = color;
    this.formGroup.get('Type').setValue(this.color);
  }

}
