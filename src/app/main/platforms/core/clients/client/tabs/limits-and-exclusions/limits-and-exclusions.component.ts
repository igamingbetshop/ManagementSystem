import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgGridAngular } from "ag-grid-angular";

import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Controllers, Methods } from "../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";
import { DatePipe } from '@angular/common';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';

@Component({
  selector: 'app-limits-and-exclusions',
  templateUrl: './limits-and-exclusions.component.html',
  styleUrls: ['./limits-and-exclusions.component.scss']
})
export class LimitsAndExclusionsComponent extends BaseGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  clientId: number;
  selfLimitsformGroup: UntypedFormGroup;
  systemLimitsformGroup: UntypedFormGroup;
  exclusionsFormGroup: UntypedFormGroup;
  exclusions;
  rowData = [];
  columnDefs = [];
  selectedExclusionType;
  types = [{ Id: 1, Name: 'Permanently' }, { Id: 2, Name: 'Temporary' }];
  selectedType;
  date = new Date();
  isEditSelfLimits = false;
  isSystemLimitsEdit = false;
  selfExcludedUntil;
  systemExcludedUntil;
  commentTemplates = [];
  comentType;
  diactivateReasons = [];
  diactivateReasonType;
  diactivateSelfReasonType;

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    protected injector: Injector,
    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
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
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.path = this.router.url.split('?')[0] + '/' + params.data.Id;
          return data;
        },
        sortable: false
      }
    ];
  }

  ngOnInit(): void {
    this.featchCommentTemplates();
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.selfLimitsFormValues();
    this.exclusionsFormValues();
    this.systemLimitsFormValues();
    this.getClientLimitSettings();
    this.getObjectHistory();
    this.featchDiactivateTemplates();
  }

  featchCommentTemplates() {
    this.apiService.apiPost(this.configService.getApiUrl, 4, true,
      Controllers.CONTENT, Methods.GET_COMMENT_TEMPLATES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.commentTemplates = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }


  featchDiactivateTemplates() {
    this.apiService.apiPost(this.configService.getApiUrl, 6, true,
      Controllers.CONTENT, Methods.GET_COMMENT_TEMPLATES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.diactivateReasons = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  setCommetns(event) {
    this.comentType = event;
  }

  setDiactivateCommetns(event) {
    this.diactivateReasonType = event;
  }

  setDiactivateSelfCommetns(event) {
    this.diactivateSelfReasonType = event;
  }

  getClientLimitSettings() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_LIMIT_SETTINGS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.exclusions = data.ResponseObject;
          this.selfExcludedUntil = this.exclusions.SelfExcluded;
          this.systemExcludedUntil = this.exclusions.SystemExcluded;
          this.selfLimitsformGroup.patchValue(this.exclusions);
          this.systemLimitsformGroup.patchValue(this.exclusions);
          this.comentType = null;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  getObjectHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, { ObjectId: this.clientId, ObjectTypeId: 91 }, true,
      Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        }
      });
  }

  private selfLimitsFormValues() {
    this.selfLimitsformGroup = this.fb.group({
      ClientId: [+this.clientId],
      DepositLimitDaily: this.fb.group({ ChangeDate: [null], CreatedDate: [null], Limit: [null], UpdateLimit: [null] }),
      DepositLimitWeekly: this.fb.group({ ChangeDate: [null], CreatedDate: [null], Limit: [null], UpdateLimit: [null] }),
      DepositLimitMonthly: this.fb.group({ ChangeDate: [null], CreatedDate: [null], Limit: [null], UpdateLimit: [null] }),
      TotalBetAmountLimitDaily: this.fb.group({ ChangeDate: [null], CreatedDate: [null], Limit: [null], UpdateLimit: [null] }),
      TotalBetAmountLimitWeekly: this.fb.group({ ChangeDate: [null], CreatedDate: [null], Limit: [null], UpdateLimit: [null] }),
      TotalBetAmountLimitMonthly: this.fb.group({ ChangeDate: [null], CreatedDate: [null], Limit: [null], UpdateLimit: [null] }),
      TotalLossLimitDaily: this.fb.group({ ChangeDate: [null], CreatedDate: [null], Limit: [null], UpdateLimit: [null] }),
      TotalLossLimitWeekly: this.fb.group({ ChangeDate: [null], CreatedDate: [null], Limit: [null], UpdateLimit: [null] }),
      TotalLossLimitMonthly: this.fb.group({ ChangeDate: [null], CreatedDate: [null], Limit: [null], UpdateLimit: [null] }),
      SessionLimit: [null],
      SessionLimitDaily: [null],
      SessionLimitWeekly: [null],
      SessionLimitMonthly: [null],
      IsSystemLimit: false
    });
  }

  private systemLimitsFormValues() {
    this.systemLimitsformGroup = this.fb.group({
      ClientId: [+this.clientId],
      SystemDepositLimitDaily: [null],
      SystemDepositLimitWeekly: [null],
      SystemDepositLimitMonthly: [null],
      SystemTotalBetAmountLimitDaily: [null],
      SystemTotalBetAmountLimitWeekly: [null],
      SystemTotalBetAmountLimitMonthly: [null],
      SystemTotalLossLimitDaily: [null],
      SystemTotalLossLimitWeekly: [null],
      SystemTotalLossLimitMonthly: [null],
      SystemSessionLimit: [null],
      SystemSessionLimitDaily: [null],
      SystemSessionLimitWeekly: [null],
      SystemSessionLimitMonthly: [null],
      IsSystemLimit: true
    });
  }

  onSelfLimitsSubmit() {
    const selfLimits = this.selfLimitsformGroup.getRawValue();
    this.mapResponseData(selfLimits);
    this.apiService.apiPost(this.configService.getApiUrl, selfLimits, true,
      Controllers.CLIENT, Methods.SAVE_CLIENT_LIMIT_SETTINGS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.isEditSelfLimits = false;
          this.getClientLimitSettings();
          SnackBarHelper.show(this._snackBar, {
            Description: 'The Client Limit Settings has been updated successfully',
            Type: "success"
          });
          this.getObjectHistory();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSystemimitsSubmit() {
    const client = this.systemLimitsformGroup.getRawValue();
    this.setEmpetyValue(client);
    this.apiService.apiPost(this.configService.getApiUrl, client, true,
      Controllers.CLIENT, Methods.SAVE_CLIENT_LIMIT_SETTINGS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.isSystemLimitsEdit = false;
          this.getClientLimitSettings();
          SnackBarHelper.show(this._snackBar, {
            Description: 'The Client Limit Settings has been updated successfully',
            Type: "success"
          });
          this.getObjectHistory();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  mapResponseData(selfLimits) {
    for (const key of Object.keys(selfLimits)) {

      if (selfLimits[key]?.hasOwnProperty('Limit')) {
        selfLimits[key] = selfLimits[key]['Limit'];
      }

      if (selfLimits[key] === null) {
        selfLimits[key] = -1;
      }
    }
  }

  setEmpetyValue(selfLimits) {
    for (const key of Object.keys(selfLimits)) {

      if (selfLimits[key] === null) {
        selfLimits[key] = -1;
      }
    }
    return selfLimits;
  }

  private exclusionsFormValues() {
    this.exclusionsFormGroup = this.fb.group({
      ClientId: [+this.clientId],
      Type: [null, [Validators.required]],
      ToDate: [this.date]
    })
  }

  changeSelectedType(event) {
    this.selectedType = event;
  }

  onDateChange(event) {
    this.date = event.value;
  }


  onSubmitExclusionsForm() {
    if (!this.exclusionsFormGroup.valid) {
      return;
    }
    if (this.exclusionsFormGroup.get('Type').value === 1) {
      this.exclusionsFormGroup.get('ToDate').setValue(new Date())
    } else {
      const a = this.date.setUTCHours(24, 0, 0, 0);
      this.exclusionsFormGroup.get('ToDate').setValue(new Date(a).toISOString())
    }
    const client = this.exclusionsFormGroup.getRawValue();
    client.Reason = this.comentType;

    this.apiService.apiPost(this.configService.getApiUrl, client, true,
      Controllers.CLIENT, Methods.APPLY_SYSTEM_EXCLUSION).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, {
            Description: 'Excluded',
            Type: "success"
          });
          this.exclusionsFormGroup.reset();
          this.comentType = null;
          this.getClientLimitSettings();
          this.getObjectHistory();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onDeactivate(method) {
    let reasonId;
    if (method === 'REMOVE_SYSTEM_EXCLUSION') {
      reasonId = this.diactivateReasonType;
    } else {
      reasonId = this.diactivateSelfReasonType;
    }
    this.apiService.apiPost(this.configService.getApiUrl, { Reason: reasonId, ClientId: +this.clientId }, true,
      Controllers.CLIENT, Methods[method]).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, {
            Description: 'Deactivated',
            Type: "success",
          });
          this.diactivateReasonType = null;
          this.diactivateSelfReasonType = null;
          this.getClientLimitSettings();
          this.getObjectHistory();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


}
