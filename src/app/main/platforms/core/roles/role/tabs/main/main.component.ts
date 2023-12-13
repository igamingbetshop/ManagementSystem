import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {Controllers, Methods} from 'src/app/core/enums';
import {CommonDataService, ConfigService} from 'src/app/core/services';
import {CoreApiService} from '../../../../services/core-api.service';
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public formGroup: UntypedFormGroup;
  public role;
  public roleId: number;
  public partners: any[] = [];
  public permissions: any[] = [];
  public currentIndex = 1;
  selectedRow: any = null;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    private configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
  ) {
  }

  ngOnInit() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.PERMISSION, Methods.GET_PERMISSIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.permissions = data.ResponseObject
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
    this.roleId = +this.activateRoute.snapshot.queryParams.roleId;
    this.partners = this.commonDataService.partners;

    this.createForm();
    this.getUser();

  }


  getUser() {
    this.apiService.apiPost(this.configService.getApiUrl, {Id: this.roleId},
      true, Controllers.PERMISSION, Methods.GET_ROLE_BY_ID).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.role = data.ResponseObject;
        this.formGroup.get('Name').setValue(this.role['Name']);
        this.formGroup.get('PartnerId').setValue(this.role['PartnerId']);
        this.formGroup.get('Comment').setValue(this.role['Comment']);
        this.role.RolePermissions.forEach(permission => {
          return permission['isSelected'] = true;
        })
        this.permissions.forEach(per => {
          let isElementExists = this.role.RolePermissions.find(rr => {
            return rr.Permissionid == per.Id;
          })
          if (!isElementExists) {
            this.role.RolePermissions.push({
              isSelected: false,
              RoleId: this.roleId,
              Permissionid: per.Id,
              IsForAll: per.IsForAll
            })
          }
        })
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });

  }

  checkAll(permission) {
    if (permission.IsForAll) {
      permission.isSelected = true;
    }
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null],
      Name: [null],
      Comment: [null],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onRowClick(row: any) {
    this.selectedRow = row;
  }

  isRowSelected(row: any): boolean {
    return this.selectedRow === row;
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    let copy = this.role;
    copy['Name'] = obj['Name'];
    copy['PartnerId'] = obj['PartnerId'];
    copy['Comment'] = obj['Comment'];

    let filteredPermission = this.role.RolePermissions.filter(per => {
      return per.isSelected === true;
    })
    copy.RolePermissions = filteredPermission;
    this.apiService.apiPost(this.configService.getApiUrl, copy,
      true, Controllers.PERMISSION, Methods.SAVE_ROLE).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        SnackBarHelper.show(this._snackBar, {Description: 'The role has been updated successfully', Type: "success"});
        this.getUser();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });


  }

}
