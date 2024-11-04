import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SportsbookApiService } from '../../../../../services/sportsbook-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonDataService, ConfigService } from '../../../../../../../../core/services';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { SnackBarHelper } from '../../../../../../../../core/helpers/snackbar.helper';

@Component({
  selector: 'app-add-edit-sub-menu',
  templateUrl: './add-edit-sub-menu.component.html',
  styleUrls: ['./add-edit-sub-menu.component.scss']
})
export class AddEditSubMenuComponent implements OnInit {
  action: string;
  partnerId: string;
  menuItem: any;
  formGroup: UntypedFormGroup;
  validDocumentSize: boolean;
  validDocumentFormat: boolean;
  checkDocumentSize: boolean;
  iconChanging: string;
  showFile = false;
  isSendingRequest = false;
  type = 'text'

  constructor(
    public dialogRef: MatDialogRef<AddEditSubMenuComponent>,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public commonDataService: CommonDataService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.action = this.data.action;
    this.menuItem = this.data;
    this.initializeForm();
    this.showFile = !!this.menuItem.Icon;
  }

  initializeForm() {
    this.formGroup = this.fb.group({
      Id: [this.menuItem?.Id || null],
      Title: [this.menuItem?.Title || '', Validators.required],
      Type: [this.menuItem?.Type || ''],
      Icon: [this.menuItem?.Icon || ''],
      Href: [this.menuItem?.Href || ''],
      Order: [this.menuItem?.Order || '', Validators.required],
      OpenInRouting: [this.menuItem?.OpenInRouting || false],
      MenuItemId: [this.menuItem?.MenuItemId || null],
      IsColor: [false],
      Image: [null],
    });
  }

  resetFormForSportNumber() {
    this.formGroup.patchValue({
      Type: 0 
    });
    this.formGroup.get('Type').setValidators([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]);
    this.formGroup.get('Type').updateValueAndValidity();
  }

  changeIcon(event: Event) {
    this.iconChanging = (event.target as HTMLInputElement).value;
    this.showFile = !!this.iconChanging;
  }

  uploadFile(event: Event) {
    const files = (event.target as HTMLInputElement).files?.[0];

    if (files) {
      this.validDocumentSize = files.size < 900000;
      this.validDocumentFormat = /(\.jpg|\.jpeg|\.png|\.gif|\.html|\.svg|\.ttf|\.otf|\.woff|\.woff2)$/.test(files.name);

      if (this.validDocumentFormat && this.validDocumentSize) {
        this.checkDocumentSize = true;
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;
          this.formGroup.patchValue({
            Image: binaryString.split(',')[1], 
            Icon: files.name
          });
        };
        reader.readAsDataURL(files);
      } else {
        this.checkDocumentSize = false;
        SnackBarHelper.show(this._snackBar, { Description: 'Invalid file format or size.', Type: 'error' });
      }
    }
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }

    this.isSendingRequest = true;
    const formValue = this.formGroup.getRawValue();

    this.apiService.apiPost('cms/savewebsitesubmenuitem', formValue)
      .pipe(take(1))
      .subscribe(
        (response) => {
          if (response.Code === 0) {
            this.dialogRef.close(response.ResponseObject);
          } else {
            SnackBarHelper.show(this._snackBar, { Description: response.Description, Type: 'error' });
          }
          this.isSendingRequest = false;
        },
        () => {
          this.isSendingRequest = false;
          SnackBarHelper.show(this._snackBar, { Description: 'An error occurred.', Type: 'error' });
        }
      );
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }
}
