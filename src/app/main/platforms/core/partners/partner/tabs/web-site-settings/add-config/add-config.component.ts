import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { take } from "rxjs/operators";

import { CoreApiService } from "../../../../../services/core-api.service";
import { ConfigService } from "../../../../../../../../core/services";
import { Controllers, Methods } from "../../../../../../../../core/enums";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-config',
  templateUrl: './add-config.component.html',
  styleUrls: ['./add-config.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule
  ]
})
export class AddConfigComponent implements OnInit {
  rowId;
  formGroup: UntypedFormGroup;
  types = [
    "A", "AAAA", "CAA", "CERT", "CNAME",
    "DNSKEY", "DS", "HTTPS", "LOC", "MX", "NAPTR", "NS", "PTR", "SMIMEA", "SPF", "SRV",
    "SSHFP", "SVCB", "TLSA", "TXT", "URI"
  ];
  isSendingReqest = false;

  constructor(
    public dialogRef: MatDialogRef<AddConfigComponent>,
    private fb: UntypedFormBuilder,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
    this.rowId = this.data.rowId;
    this.setFormGroup();
    this.subscribeToFormChanges();

  }

  setFormGroup() {
    this.formGroup = this.fb.group({
      rowId: this.rowId,
      type: [null, [Validators.required, Validators.maxLength(10)]],
      name: [null, [Validators.required, Validators.maxLength(50)]],
      content: [null, [Validators.required,]],
      priority: [null],
      ttl: [null, [Validators.required, Validators.min(60), Validators.max(86400)]],
      proxied: [false],
    })
  }

  subscribeToFormChanges() {
    this.formGroup.get("type").valueChanges.subscribe(selectedValue => {
      if(selectedValue == "MX")
      this.formGroup.get('priority').setValidators([Validators.required]);
    })
  }

  onSubmit() {
    const value = this.formGroup.getRawValue();
    this.isSendingReqest = true; 
    this.apiService.apiPost(this.configService.getApiUrl, value, true, Controllers.PARTNER,
      Methods.ADD_DNS_RECORD).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(value);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false; 
      });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onClose() {
    this.dialogRef.close();
  }

}
