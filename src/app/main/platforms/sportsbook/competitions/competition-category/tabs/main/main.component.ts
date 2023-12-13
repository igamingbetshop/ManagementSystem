import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {SportsbookApiService} from '../../../../services/sportsbook-api.service';
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {CommonDataService} from "../../../../../../../core/services";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public formGroup: UntypedFormGroup;
  public competitionId: number;
  public partnerId: number;
  public competition: any;
  public providers: any[] = [];
  public regions: any[] = [];
  public multipleBets = [
    {Id: null, Name: this.translate.instant('Sport.None')},
    {Id: true, Name: this.translate.instant('Common.Yes')},
    {Id: false, Name: this.translate.instant('Common.No')},
  ];

  public isEdit = false;
  public partnerName: string = '';

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    private activateRoute: ActivatedRoute,
    private commonDataService: CommonDataService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })

    this.apiService.apiPost('regions').subscribe(data => {
      if (data.Code === 0) {
        this.regions = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })

    this.competitionId = +this.activateRoute.snapshot.queryParams.competitionId;
    this.handlePartner();
    this.createForm();
    this.getPartner();
  }

  handlePartner() {
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    const partners = this.commonDataService.partners;
    this.partnerName = partners.find(field => field.Id === this.partnerId)?.Name;
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  public createForm() {
    this.formGroup = this.fb.group({
      RegionId: [null, ],
      Priority: [null],
      ProviderId: [null, [Validators.required]],
      Id: [null],
      CategoryId: [null, ],
      Delay: [null, ],
      Rating: [null, ],
      MaxWinPrematchSingle: [null],
      MaxWinPrematchMultiple: [null],
      MaxWinLiveSingle: [null],
      MaxWinLiveMultiple: [null],
      AbsoluteLimit: [null],
      Enabled: [false],
      AllowMultipleBets: [null],
      AllowCashout: [null],
    });
  }

  getPartner() {
    const filter = {
      Ids: {
        ApiOperationTypeList: [{
          OperationTypeId: 1,
          IntValue: this.competitionId,
          DecimalValue: this.competitionId
        }]
      }
    }
    filter['PartnerId'] = this.partnerId || null;

    this.apiService.apiPost('competitions', filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.competition = data.Objects[0];
          this.formGroup.get('RegionId').setValue(this.competition['RegionId']);
          this.formGroup.get('Priority').setValue(this.competition['Priority']);
          this.formGroup.get('ProviderId').setValue(this.competition['ProviderId']);
          this.formGroup.get('Id').setValue(this.competition['Id']);
          this.formGroup.get('CategoryId').setValue(this.competition['CategoryId']);
          this.formGroup.get('Delay').setValue(this.competition['Delay']);
          this.formGroup.get('Rating').setValue(this.competition['Rating']);
          this.formGroup.get('MaxWinPrematchSingle').setValue(this.competition['MaxWinPrematchSingle']);
          this.formGroup.get('MaxWinPrematchMultiple').setValue(this.competition['MaxWinPrematchMultiple']);
          this.formGroup.get('MaxWinLiveSingle').setValue(this.competition['MaxWinLiveSingle']);
          this.formGroup.get('MaxWinLiveMultiple').setValue(this.competition['MaxWinLiveMultiple']);
          this.formGroup.get('AbsoluteLimit').setValue(this.competition['AbsoluteLimit']);
          this.formGroup.get('AllowMultipleBets').setValue(this.competition['AllowMultipleBets']);
          this.formGroup.get('AllowCashout').setValue(this.competition['AllowCashout']);
          this.formGroup.get('Enabled').setValue(this.competition['Enabled']);
          this.competition.RegionName = this.regions.find(p => p.Id === this.competition?.RegionId)?.Name;
          this.competition.ProviderName = this.providers.find(p => p.Id === this.competition?.ProviderId)?.Name;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();

    this.apiService.apiPost('competitions/update', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.isEdit = false;
          this.getPartner();
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

}
