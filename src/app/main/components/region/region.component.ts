import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { take } from "rxjs";
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfigService } from 'src/app/core/services';
import { Field } from 'src/app/core/models';
import { CoreApiService } from '../../platforms/core/services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-set-region',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule
  ],
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ],
})
export class RegionComponent implements OnInit {
  field = input.required<Field>();
  parentContainer = inject(ControlContainer);
  configService = inject(ConfigService);
  cdr = inject(ChangeDetectorRef);
  countries: WritableSignal<any[]> = signal([]);
  cities: WritableSignal<any[]> = signal([]);
  districts: WritableSignal<any[]> = signal([]);
  private apiService = inject(CoreApiService);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.initializeFormControls();
    this.fetchRegions('Country'); // Fetch country data after form control initialization
  }
  
  initializeFormControls() {
    const formGroup = this.parentFormGroup;
    if(this.field().Type === 'Region1') {
      formGroup.addControl('Country', new FormControl("", Validators.required));
    } else if(this.field().Type === 'Region2') {
      formGroup.addControl('Country', new FormControl("", Validators.required));
      formGroup.addControl('City', new FormControl("", Validators.required));
    } else if(this.field().Type === 'Region3') {
      formGroup.addControl('Country', new FormControl("", Validators.required));
      formGroup.addControl('City', new FormControl("", Validators.required));
      formGroup.addControl('District', new FormControl("", Validators.required));
    }
  }

  fetchRegions(type: string) {
    const data: any = { TypeId: 5 };

    if (type === 'Country') {
      data.TypeId = 5;
    } else if (type === 'City') {
      const countryControl = this.parentFormGroup.get('Country');
      if (!countryControl || !countryControl.value) return;
      data.TypeId = 3;
      data.ParentId = countryControl.value;
    } else if (type === 'District') {
      const cityControl = this.parentFormGroup.get('City');
      if (!cityControl || !cityControl.value) return;
      data.TypeId = 2;
      data.ParentId = cityControl.value;
    }

    this.apiService.apiPost(this.configService.getApiUrl, data, true, Controllers.REGION, Methods.GET_REGIONS)
      .pipe(take(1))
      .subscribe(resp => {
        if (resp.ResponseCode === 0) {
          if (type === 'City') {
            this.cities.set(resp.ResponseObject);
          } else if (type === 'District') {
            this.districts.set(resp.ResponseObject);
          } else if (type === 'Country') {
            this.countries.set(resp.ResponseObject);
          }
          this.cdr.detectChanges();
        }
      });
  }


}
