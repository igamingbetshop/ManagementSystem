import {Component, Inject, NgModule, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService, LocalStorageService} from "../../../../../../../../core/services";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {CoreSignalRService} from "../../../../../services/core-signal-r.service";
import {Methods} from "../../../../../../../../core/enums";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatSelectModule} from "@angular/material/select";

import {MatInputModule} from "@angular/material/input";

import {MatButtonModule} from "@angular/material/button";

import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-create-new-ticket',
  templateUrl: './create-new-ticket.component.html',
  styleUrls: ['./create-new-ticket.component.scss']
})
export class CreateNewTicketComponent implements OnInit {
  partners: any[] = [];
  formGroup: UntypedFormGroup;
  private clientId = null;
  isSendingReqest = false; 

  constructor(
    public dialogRef: MatDialogRef<CreateNewTicketComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public configService: ConfigService,
    private _signalR: CoreSignalRService,
    @Inject(MAT_DIALOG_DATA) private data,
    private localStorage: LocalStorageService,
    private activateRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      PartnerId: [null, [Validators.required]],
      Subject: [null,[Validators.required]],
      Message: [null,[Validators.required]],
      ClientIds: [{value: this.clientId, disabled: true}],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.formGroup.valid){
      this.isSendingReqest = true; 
      const requestBody = this.formGroup.getRawValue();
      requestBody.Token = this.localStorage.get('token');
      requestBody.ClientIds = requestBody.ClientIds.split(',');
      this._signalR.connection.invoke(Methods.CREATE_TICKET, requestBody).then(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(data.ResponseObject);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        this.isSendingReqest = false; 
      });
    }
  }
}

@NgModule({
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
  ],
  declarations: [CreateNewTicketComponent]
})

export class CreateNewTicketModule {}
