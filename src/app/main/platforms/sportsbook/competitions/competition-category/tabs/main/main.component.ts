import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { CommonDataService } from "../../../../../../../core/services";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  formGroup: UntypedFormGroup;
  competitionId: number;
  partnerId: number;
  competition: any;
  providers: any[] = [];
  regions: any[] = [];
  multipleBets: any[] = [];
  isEdit = false;
  partnerName: string = '';
  name: string = '';
  sportId: number;

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    private activateRoute: ActivatedRoute,
    private commonDataService: CommonDataService,
    private translate: TranslateService,
  ) {
    this.multipleBets = [
      { Id: null, Name: this.translate.instant('Sport.None') },
      { Id: true, Name: this.translate.instant('Common.Yes') },
      { Id: false, Name: this.translate.instant('Common.No') },
    ];
  }

  ngOnInit() {
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.competitionId = +this.activateRoute.snapshot.queryParams.competitionId;
    this.featchProviders();
    this.featchRegions();
    this.handlePartner();
    this.createForm();
    this.getPartner();
  }

  featchProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  featchRegions() {
    this.apiService.apiPost('regions').subscribe(data => {
      if (data.Code === 0) {
        this.regions = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
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
      RegionId: [null,],
      Priority: [null],
      ProviderId: [null, [Validators.required]],
      Id: [null],
      CategoryId: [null,],
      Delay: [null,],
      Rating: [null,],
      MaxWinPrematchSingle: [null],
      MaxWinPrematchMultiple: [null],
      MaxWinLiveSingle: [null],
      MaxWinLiveMultiple: [null],
      AbsoluteLimit: [null],
      Enabled: [false],
    });
  }

  getPartner() {
    const filter = {
      Id: this.competitionId
    }
    filter['PartnerId'] = this.partnerId || null;
    this.apiService.apiPost('competitions/competition', filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.competition = data.ResponseObject;
          this.formGroup.patchValue(this.competition);
          this.competition.RegionName = this.regions.find(p => p.Id === this.competition?.RegionId)?.Name;
          this.competition.ProviderName = this.providers.find(p => p.Id === this.competition?.ProviderId)?.Name;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    if (this.partnerId) {
      obj.PartnerId = this.partnerId;
    }
    if (this.sportId) {
      obj.SportId = this.sportId;
    }
    this.apiService.apiPost('competitions/update', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.isEdit = false;
          this.getPartner();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
