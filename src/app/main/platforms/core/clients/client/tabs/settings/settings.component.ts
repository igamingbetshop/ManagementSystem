import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Controllers, GridRowModelTypes, Methods } from "../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { OpenerComponent } from "../../../../../../components/grid-common/opener/opener.component";
import { DatePipe } from "@angular/common";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowData = [];
  public clientId;
  public statusMessage;
  public formGroup: UntypedFormGroup;
  public isReadOnly = true;
  public amlVerifiedTypes = [
    { Id: 1, Name: 'YES' },
    { Id: 0, Name: 'NO' }
  ];
  public amlStatusTypes = [
    { Id: 1, Name: 'PEP' },
    { Id: 2, Name: 'BLOCK' },
    { Id: 3, Name: 'NA' }
  ];
  public casinoLayout = [
    { Id: 1, Name: 'grid' },
    { Id: 2, Name: 'content' },
    { Id: 3, Name: 'list' }
  ];
  public clientStatuses = {
    isLogin: false,
    isDeposit: false,
    isWithdraw: false,
    isCommunications: false,
    isBet: false
  };
  public settings;
  public selectedCasinoLayout;

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.ChangeDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.Created By',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPrize',
        sortable: true,
        resizable: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'setting').split('?')[0];
          data.queryParams = { setting: params.data.Id };
          return data;
        },
        sortable: false
      }
    ];
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.formValues();
    this.getSettings();
    this.getHistory();
  }

  formValues() {
    this.formGroup = this.fb.group({
      AMLProhibited: [null],
      AMLVerified: [null],
      BlockedForBonuses: [null],
      BlockedForInactivity: [null],
      CasinoLayout: [null],
      CautionSuspension: [null],
      DocumentExpired: [{ value: null, disabled: true }],
      SelfExcluded: [{ value: null, disabled: true }],
      Younger: [{ value: null, disabled: true }],
      Restricted: [null],
      SystemExcluded: [{ value: null, disabled: true }],
      DocumentVerified: [null],
      JCJProhibited: [{ value: null, disabled: true }],
      PasswordChangedDate: [{ value: null, disabled: true }],
      SessionLimit: [{ value: null, disabled: true }],
      UnusedAmountWithdrawPercent: [null],
      AMLPercent: [null],
      PEPSanctioned: [null],
      UnderHighRiskCountry: [null]
    });
  }

  getSettings() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.settings = data.ResponseObject;
          this.formGroup.patchValue(this.settings);
          this.setStatusMessage();

          this.clientStatuses.isLogin = this.settings.AMLProhibited != 2 && !this.settings.JCJProhibited && !this.settings.DocumentExpired && !this.settings.SelfExcluded &&
            !this.settings.Younger && !this.settings.Restricted && !this.settings.CautionSuspension &&
            !this.settings.SystemExcluded;

          this.clientStatuses.isDeposit = this.settings.AMLProhibited != 2 && !this.settings.JCJProhibited && this.settings.AMLVerified !== 0 && !this.settings.BlockedForInactivity &&
            !this.settings.DocumentExpired && !this.settings.SelfExcluded && !this.settings.Younger && !this.settings.Restricted &&
            !this.settings.SystemExcluded && !this.settings.CautionSuspension && !!this.settings.DocumentVerified && !!this.settings.TermsConditionsAcceptanceVersion;

          this.clientStatuses.isBet = this.settings.AMLProhibited != 2 && !this.settings.JCJProhibited && this.settings.AMLVerified !== 0 && !this.settings.BlockedForInactivity
            && !this.settings.SelfExcluded && !this.settings.Younger && !this.settings.Restricted &&
            !this.settings.SystemExcluded && !this.settings.CautionSuspension && !!this.settings.DocumentVerified && !!this.settings.TermsConditionsAcceptanceVersion;

          this.clientStatuses.isWithdraw = this.settings.AMLProhibited != 2 && this.settings.AMLVerified !== 0 && !this.settings.BlockedForInactivity && !this.settings.DocumentExpired &&
            !this.settings.Younger && !this.settings.Restricted && !this.settings.CautionSuspension && !!this.settings.DocumentVerified && !!this.settings.TermsConditionsAcceptanceVersion;

          this.clientStatuses.isCommunications = this.settings.AMLProhibited != 2 && !this.settings.JCJProhibited && this.settings.AMLVerified !== 0 && !this.settings.BlockedForInactivity &&
            !this.settings.SelfExcluded && !this.settings.Younger && !this.settings.Restricted && !this.settings.SystemExcluded &&
            !this.settings.CautionSuspension && !!this.settings.TermsConditionsAcceptanceVersion;
        }
      });
  }

  onCheckClientExternalStatus() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.CHECK_CLIENT_EXTERNAL_STATUS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getSettings();
          this.getHistory();
          SnackBarHelper.show(this._snackBar, { Description: 'Updated', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, { ObjectId: this.clientId, ObjectTypeId: 76 }, true,
      Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          this.rowData = [];
        }
      });
  }

  onSubmit() {
    const requestBody = this.formGroup.getRawValue();
    delete requestBody.PasswordChangedDate;
    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true,
      Controllers.CLIENT, Methods.UPDATE_CLIENT_SETTINGS, this.clientId).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.settings = data.ResponseObject;
          SnackBarHelper.show(this._snackBar, { Description: 'Changes successfully updated', Type: "success" });
          this.isReadOnly = true;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  changeSelectedCasinoLayout(event) {
    this.selectedCasinoLayout = event;
  }

  setStatusMessage() {
    if (!this.settings.DocumentVerified)
      this.statusMessage = 'PV - PENDIENTE VALIDACIÓN';
    else if (this.settings.Younger)
      this.statusMessage = 'MEN - MENOR DE EDAD';
    else if (this.settings.AMLVerified && this.settings.AMLProhibited == false)
      this.statusMessage = 'PR - PROHIBIDO AML';
    else if (this.settings.JCJProhibited)
      this.statusMessage = 'LE - LISTA DE EXCLUIDOS';
    else if (this.settings.SelfExcluded)
      this.statusMessage = 'AE - AUTO EXCLUIDO';
    else if (this.settings.Restricted)
      this.statusMessage = 'CC - CUENTA CERRADA';
    else if (this.settings.CautionSuspension)
      this.statusMessage = 'SC - SUSPENSIÓN CAUTELAR';
    else if (this.settings.SystemExcluded)
      this.statusMessage = 'EC - EXCLUSION IMPUESTA SISTEMA';
    else if (this.settings.DocumentExpired)
      this.statusMessage = 'DC - DOCUMENTO CADUCADO';
    else if (this.settings.BlockedForInactivity)
      this.statusMessage = 'IN - INACTIVIDAD';
    else
      this.statusMessage = 'VALIDADO DOCUMENTALMENTE';
  }

  get errorControls() {
    return this.formGroup.controls;
  }
}
