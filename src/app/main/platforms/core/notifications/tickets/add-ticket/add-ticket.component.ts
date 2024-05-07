import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonDataService, ConfigService, LocalStorageService } from 'src/app/core/services';
import { CoreApiService } from '../../../services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { CoreSignalRService } from "../../../services/core-signal-r.service";
import { take } from 'rxjs';


@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class AddTicketComponent implements OnInit  {

  partners: any[] = [];
  partnerId = null;
  formGroup: UntypedFormGroup;
  segments;
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddTicketComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public configService: ConfigService,
    private _signalR: CoreSignalRService,
    @Inject(MAT_DIALOG_DATA) private data,
    private localStorage: LocalStorageService,

  ) {
  }

  ngOnInit() {
    this.partnerId = this.data.partnerId;
    this.partners = this.commonDataService.partners;
    this.createForm();
    this.getPartnerPaymentSegments(this.partnerId);

  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [this.partnerId, [Validators.required]],
      Subject: [null, [Validators.required]],
      Message: [null, [Validators.required]],
      SegmentIds: [null],
      ClientIds: [null],
    });
  }

  getPartnerPaymentSegments(partnerId) {
    this.apiService.apiPost(this.configService.getApiUrl, { PartnerId: partnerId }, true,
      Controllers.CONTENT, Methods.GET_SEGMENTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.segments = data.ResponseObject;
        }
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }



  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.valid || this.isSendingReqest) {
      this.isSendingReqest = true;
      const requestBody = this.formGroup.getRawValue();
      requestBody.Token = this.localStorage.get('token');
      if ((requestBody.SegmentIds == null && requestBody.ClientIds == null)) {
        SnackBarHelper.show(this._snackBar, { Description: "At least one of SegmentIds or ClientIds is required.", Type: "error" });
        return;
      }
      if(requestBody.ClientIds != null) {
        requestBody.ClientIds = requestBody.ClientIds.split(',');
      }
      this._signalR.connection.invoke(Methods.CREATE_TICKET, requestBody).then(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
    }
  }

}
