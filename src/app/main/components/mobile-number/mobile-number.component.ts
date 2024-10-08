import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { MatInput, MatInputModule } from "@angular/material/input";

import { ConfigService } from 'src/app/core/services';
import { getValidatorsFromField } from 'src/app/core/validators/validation-formfield.valodators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Field } from 'src/app/core/models';
import { TranslateModule } from '@ngx-translate/core';
import { CoreApiService } from '../../platforms/core/services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';

type Code = {
  Value: string;
  Name: string;
  Country: string;
  Mask: string;
}

@Component({
  selector: 'mobile-number-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './mobile-number.component.html',
  styleUrl: './mobile-number.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class MobileNumberRegComponent implements OnInit {
  codes = signal<Code[]>([]);
  field = input.required<Field>();
  parentContainer = inject(ControlContainer);
  apiService = inject(CoreApiService);
  configService = inject(ConfigService)
  _snackBar = inject(MatSnackBar);
  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.fetchCountryCodes();
    const validators = getValidatorsFromField(this.field());
    this.parentFormGroup.addControl("MobileCode", new FormControl("", validators));
    this.parentFormGroup.addControl("MobileNumber", new FormControl("", validators));
  }

  fetchCountryCodes() {
    this.apiService.apiPost(this.configService.getApiUrl, {PartnerId: 1},
      true, Controllers.PARTNER, Methods.GET_PARTNER_MOBILE_CODES).subscribe(data => {
        if (data.ResponseCode === 0) {
          let subMenuItems = data.ResponseObject;
          this.codes.set(subMenuItems.map(subMenuItem => {
            const c:Code = {
              Value:subMenuItem.Type,
              Name:subMenuItem.Title,
              Country:subMenuItem.StyleType,
              Mask:subMenuItem.Mask
            }
            return c;
          }) || []);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

      })
  }


}
