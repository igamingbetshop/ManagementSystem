import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { DateAdapter } from "@angular/material/core";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { JACKPOT_TYPE_STATUSES } from '../../../core-jackpot.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  commonId;
  formGroup: UntypedFormGroup;
  isEdit = false;
  commonSettings;
  partners;
  bonusTypes = [];
  bonusTypeId: number;
  counts: any[] = [];
  campaigns = [];
  selectedType: number;
  campaignTypes;
  jackpot: any;

  constructor(
    private apiService: CoreApiService,
    private commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    protected injector: Injector,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>,
  ) {
  }

  ngOnInit() {
    this.commonId = this.activateRoute.snapshot.queryParams.Id;
    this.partners = this.commonDataService.partners;
    this.formValues();
    this.getJakpot();
  }

  getJakpot() {
    let data = {     
      Id: +this.commonId,
    };
    this.apiService.apiPost(this.configService.getApiUrl, data, true, Controllers.BONUS, Methods.GET_JACKPOTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {         
          this.jackpot = data.ResponseObject[0];
            this.jackpot.Types = JACKPOT_TYPE_STATUSES.find((type) => { return type.Id == this.jackpot.Type })?.Name;
            this.jackpot.CreationDate = this.jackpot.CreationDate ? new Date(this.jackpot.CreationDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            
            this.jackpot.LastUpdateDate = this.jackpot.LastUpdateDate ? new Date(this.jackpot.LastUpdateDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            
            this.jackpot.FinishTimes = this.jackpot.FinishTime ? new Date(this.jackpot.FinishTime).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            
            this.jackpot.PartnerName = this.partners.find((partner) => { return partner.Id == this.jackpot.PartnerId })?.Name;
            this.formGroup.patchValue(this.jackpot);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }        
      });
  }

  formValues() {
    this.formGroup = this.fb.group({
      Id: [0],
      Name: [null, [Validators.required]],
      PartnerId: [null],
      Type: [2],
      Amount: [null, [Validators.required]],
      FinishTime: [null, [Validators.required]],
      RightBorder: [0],
      LeftBorder: [0]
    })
  }

  onSubmit() {
    const requestBody = this.formGroup.getRawValue();
    delete requestBody.PartnerName;


    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true,
      Controllers.BONUS, Methods.SAVE_JACKPOTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.getJakpot();
          this.isEdit = false;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
