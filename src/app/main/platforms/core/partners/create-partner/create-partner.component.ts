import {Component, NgModule, OnInit} from '@angular/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonDataService, ConfigService} from "../../../../../core/services";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatSelectModule} from "@angular/material/select";

import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";

import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";

import {Controllers, Methods} from "../../../../../core/enums";
import {take} from "rxjs/operators";
import { ServerCommonModel } from 'src/app/core/models/server-common-model';
import { CoreApiService } from '../../services/core-api.service';

@Component({
  selector: 'create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss']
})
export class CreatePartnerComponent implements OnInit
{
  public formGroup: UntypedFormGroup;
  public partnerStates:ServerCommonModel[] = [];

  public currencies: any[] = [];

  constructor(private fb:UntypedFormBuilder,
              public dialogRef: MatDialogRef<CreatePartnerComponent>,
              private commonDataService:CommonDataService,
              private configService:ConfigService,
              private apiService:CoreApiService){}

  ngOnInit()
  {
    this.currencies = this.commonDataService.currencies;
    this.createForm();
    this.getPartnerStates();
  }

  close()
  {
    this.dialogRef.close();
  }

  private createForm()
  {
    this.formGroup = this.fb.group({
      Id: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      AdminSiteUrl: [null, [Validators.required]],
      SiteUrl: [null, [Validators.required]],
      CurrencyId: [null, [Validators.required]],
      State: [null, [Validators.required]],
    });
  }

  onSubmit()
  {
    const partner = this.formGroup.getRawValue();

    if(this.formGroup.valid)
    {
      this.apiService.apiPost(this.configService.getApiUrl, partner, true,
        Controllers.PARTNER, Methods.ADD_PARTNER).pipe(take(1)).subscribe(data => {
        if(data.ResponseCode === 0)
        {
          this.dialogRef.close(data.ResponseObject);
        }
      });
    }
  }

  private getPartnerStates()
  {
    this.apiService.apiPost(this.configService.getApiUrl, null, true,
      Controllers.ENUMERATION, Methods.GET_PARTNER_STATES).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.partnerStates = data.ResponseObject;
      }
    });
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
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule
  ],
  declarations: [CreatePartnerComponent]
})
export class CreatePartnerModule
{

}
