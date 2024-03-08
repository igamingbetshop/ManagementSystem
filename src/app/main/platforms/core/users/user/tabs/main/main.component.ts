import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Controllers, GridRowModelTypes, Methods } from 'src/app/core/enums';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from '../../../../services/core-api.service';
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { AgBooleanFilterComponent } from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { ColorEditorComponent } from "../../../../../../components/grid-common/color-editor.component";
import { CheckboxRendererComponent } from "../../../../../../components/grid-common/checkbox-renderer.component";
import { TextEditorComponent } from "../../../../../../components/grid-common/text-editor.component";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { InputMultiSelectComponent } from "./input-multi-select.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BasePaginatedGridComponent implements OnInit {
  public userId: number;
  public user: any;
  public formGroup: UntypedFormGroup;
  public types: any[] = [];
  public states: any[] = [];
  public currencies: any[] = [];
  public genders: any[] = [];
  public languages: any[] = [];
  public partners: any[] = [];
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public columnDefs = [];
  public rowData = [];
  public rowData1 = [];
  public columnDefs1 = [];
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    colorEditor: ColorEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    inputMultiSelect: InputMultiSelectComponent
  };
  public blockedData;
  public getRoles = [];
  public editUserRoles = false;
  public enableEditRole = false;
  public roles = [];
  public rowSelection = 'multiple';
  public isEdit = false;
  public passRegEx;
  public editedRolePartner;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    protected injector: Injector,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Add Role To User',
        field: 'HasRole',
        sortable: true,
        resizable: true,
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange3['bind'](this),
          onCellValueChanged: this.onCheckBoxChange3.bind(this)
        },
      },
      {
        headerName: 'Id',
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Name',
        field: 'Name',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Comment',
        field: 'Comment',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'View',
        field: 'View',
        resizable: true,
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.getRolePermission['bind'](this),
          Label: 'View',
          bgColor: '#3E4D66',
          textColor: '#FFFFFF',
        }
      },
    ];
  }

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.genders = this.commonDataService.genders;
    this.currencies = this.commonDataService.currencies;
    this.partners = this.commonDataService.partners;
    this.languages = this.commonDataService.languages;
    this.initialStates();
    this.initialTypes();
    this.initGridRight();

    this.createForm();
  }

  initGridRight(): void {
    this.columnDefs1 = [
      {
        headerName: 'Id',
        field: 'Id',
        sortable: true,
        resizable: true,
        maxWidth: 130
      },
      {
        headerName: 'Name',
        field: 'Permissionid',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Access Objects',
        field: 'AccessObjectsIds',
        sortable: true,
        resizable: true,
        cellRenderer: 'inputMultiSelect',
        cellRendererParams: {
          onInputChange: this.onInputChange['bind'](this),
          onMultipleSelect: this.onMultipleSelect['bind'](this),
          Selections: this.partners,
        }
      },
      {
        headerName: 'Save',
        field: 'Save',
        resizable: true,
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: params => {
          let IsForAll = !params.data.IsForAll ? `<button style="padding: 10px 15px; color: #FFF; background-color: #076192; border: unset; cursor: pointer; border-radius: 4px" data-action-type="save-role">Save</button>` : `<span></span>`;
          return `${IsForAll}`;
        },
        cellRendererParams: {
          onClick: this.saveRole['bind'](this),
          Label: 'Save',
        }
      },
    ]
  }

  public initialStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_USER_STATES_ENUM).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.states = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  public initialTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_USER_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {

        if (data.ResponseCode === 0) {
          this.types = data.ResponseObject;
          this.getUser();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getUser() {
    this.apiService.apiPost(this.configService.getApiUrl, this.userId,
      true, Controllers.USER, Methods.GET_USER_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.user = data.ResponseObject;
          this.user.PartnerName = this.partners.find(p => p.Id === this.user.PartnerId)?.Name;
          this.user.StateName = this.states.find(p => p.Id === this.user.State)?.Name;
          this.user.GenderName = this.genders.find(p => p.Id === this.user.Gender)?.Name;
          this.user.TypeName = this.types.find(p => p.Id === this.user.Type)?.Name;
          this.user.LanguageName = this.languages.find(p => p.Id === this.user.LanguageId)?.Name;
          this.formGroup.patchValue(this.user);

          this.getPsswordRegex(this.user['PartnerId'], this.user['Type'])
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      Id: [{ value: null, disabled: true }, [Validators.required]],
      Type: [null, [Validators.required]],
      State: [null, [Validators.required]],
      UserName: [null, [Validators.required]],
      FirstName: [null],
      Password: [null],
      LastName: [null],
      CurrencyId: [null, [Validators.required]],
      Email: [null],
      Gender: [null],
      LanguageId: [null, [Validators.required]],
      CorrectionMaxAmount: [null],
      CorrectionMaxAmountCurrency: [null],
    });
  }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "save-role":
          return this.saveRole(data);
      }
    }
  }

  public getPsswordRegex(PartnerId, Type) {

    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: PartnerId, Type: Type },
      true, Controllers.PARTNER, Methods.GET_USER_PASSWORD_REGEX).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.passRegEx = data.ResponseObject;
          let reg = new RegExp(this.passRegEx);
          this.formGroup.controls["Password"].setValidators([Validators.pattern(reg), Validators.minLength(8)]);
          this.formGroup.controls['Password'].updateValueAndValidity();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }


  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.USER, Methods.SAVE_USER).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'The User has been updated successfully', Type: "success" });
          this.isEdit = false;
          this.getUser();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  editUserRole() {
    this.editUserRoles = true;
    this.getUserRoles();
  }

  onMultipleSelect(value: number[], params): void {
    params.data.AccessObjectsIds = value;
  }

  onInputChange(value, params) {
    params.data.AccessObjectsIds = value;
  }

  getUserRoles() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.userId,
      true, Controllers.PERMISSION, Methods.GET_USER_ROLES).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getRolePermission(params) {
    this.apiService.apiPost(this.configService.getApiUrl, { UserId: +this.userId, RoleId: params.data.Id },
      true, Controllers.PERMISSION, Methods.GET_ROLE_PERMISSIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData1 = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  saveRole(params) {
    const request = {
      Id: params.data.Id,
      IsForAll: params.data.IsForAll,
      Permissionid: params.data.Permissionid,
      RoleId: params.data.RoleId,
      UserId: this.user?.Id,
      AccessObjects: params.data.AccessObjects,
      AccessObjectsIds: null,
    };

    if (typeof params.data.AccessObjectsIds === 'string') {
      request.AccessObjectsIds = params.data.AccessObjectsIds.split(',');
    } else {
      request.AccessObjectsIds = params.data.AccessObjectsIds;
    }

    this.apiService.apiPost(this.configService.getApiUrl, request,
      true, Controllers.PERMISSION, Methods.SAVE_ACCESS_OBJECTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Role successfully updated', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  saveUserRoles() {
    let saved = {
      UserId: +this.userId,
      RoleModels: this.rowData.filter(elem => elem.HasRole != false)
    };

    this.apiService.apiPost(this.configService.getApiUrl, saved,
      true, Controllers.PERMISSION, Methods.SAVE_USER_ROLES).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData1 = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCheckBoxChange3(params, val) {
    params.HasRole = val;
    this.enableEditRole = true;

    if (params.HasRole === true) {
      this.roles.push(params);
    } else if (params.HasRole === false) {
      this.roles = this.roles.filter(elem => elem.HasRole)
    }
  }

  cancel() {
    this.isEdit = false;
    this.getUser();
  }

}
