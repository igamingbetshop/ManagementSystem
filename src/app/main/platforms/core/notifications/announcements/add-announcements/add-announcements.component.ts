import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CoreApiService } from '../../../services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { ConfigService } from 'src/app/core/services';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { RECEIVER_TYPES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-add-announcements',
  templateUrl: './add-announcements.component.html',
  styleUrls: ['./add-announcements.component.scss'],
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
    MatCheckboxModule,
    MatDialogModule
  ]
})
export class AddAnnouncementsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  announcementTypes: any[] = [];
  isSendingReqest = false;
  partners: any[] = [];
  partnerId;
  announcement: any;
  isEdit = false;
  openedIndex = 0;
  validatorsDisabled = false;

  ReceiverTypeIds = RECEIVER_TYPES;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { partners: any[], partnerId, announcementTypes: any[], announcement: any },
    public dialogRef: MatDialogRef<AddAnnouncementsComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
  ) { }

  ngOnInit() {
    this.partners = this.data.partners;
    this.partnerId = this.data.partnerId;
    this.announcementTypes = this.data.announcementTypes;

    if (this.data.announcement?.Id) {
      this.isEdit = true;
    }

    this.announcement = {
      Id: undefined,
      PartnerId: this.data.partnerId,
      UserId: null,
      Type: null,
      State: 0,
      ReceiverType: null,
      Receivers: [],
      NickName: ""
    };

    if (this.isEdit) {
      // delete this.announcement.Receivers;
      this.announcement = {
        Id: this.data.announcement.Id,
        PartnerId: this.data.announcement.PartnerId,
        UserId: this.data.announcement.UserId,
        ReceiverType: this.data.announcement.ReceiverType,
        Type: this.data.announcement.Type,

        State: this.data.announcement.State == 1 ? this.data.announcement.State = 1 : this.data.announcement.State = 0,
        Message: this.data.announcement.Message,
        ReceiverId: this.data.announcement.ReceiverId,
        Receivers: this.data.announcement.Receivers,
        NickName: this.data.announcement.NickName,
      };
      this.validatorsDisabled = true
    }
    this.createForm();

    this.formGroup.valueChanges.subscribe(data => {
      if (data.Type != 5) {
        this.formGroup.get('Receivers').setValidators(Validators.required)
        this.formGroup.get('ReceiverId').setValidators(Validators.required)
      }
    });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [this.announcement.Id],
      PartnerId: [this.announcement.PartnerId, [Validators.required]],
      Type: [this.announcement.Type, [Validators.required]],
      ReceiverType: [this.announcement.ReceiverType, [Validators.required]],
      ReceiverId: [this.announcement.ReceiverId,],
      // ReceiversModel:[null, [Validators.pattern(/[aA-zZ0-9'-]$/)]],
      Receivers: [this.announcement.Receivers, Validators.pattern("^[a-zA-Z0-9_, ]*$")],
      NickName: [this.announcement.NickName, [Validators.required]],
      State: [this.announcement.State],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isSendingReqest = true;
    let announcement = this.formGroup.getRawValue();
    announcement.State == 1 ? announcement.State = 1 : announcement.State = 2;

    if (announcement?.Receivers && announcement?.Receivers.length) {
      const arrOfStr = announcement.Receivers.split(',');
      const arrOfNum = arrOfStr.map(element => {
        return Number(element);
      });
      announcement.Receivers = arrOfNum;
    }

    this.apiService.apiPost(this.configService.getApiUrl, announcement,
      true, Controllers.CONTENT, Methods.SAVE_ANNOUNCEMENT)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }
}

