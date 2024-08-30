import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Controllers, Methods} from "../../../core/enums";
import {take} from "rxjs/operators";
import {CoreApiService} from "../../platforms/core/services/core-api.service";
import {CommonDataService, ConfigService, LocalStorageService} from "../../../core/services";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatSliderModule} from "@angular/material/slider";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-partner-levels',
  standalone: true,
  templateUrl: './partner-levels.component.html',
  styleUrls: ['./partner-levels.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatSliderModule,
    MatIconModule,
    MatSelectModule
  ]
})
export class PartnerLevelsComponent implements OnInit {
  currentStep: number = 0;
  totalSteps: number = 6;
  userId: any;
  public vipLevel: any;
  partnerId: number | undefined;
  public filter: any = {};
  nthChildValue: number = this.currentStep + 1;
  openedVip = false;
  openedAboutSections: boolean[] = [];
  public partnerVipLevels = [];
  public partners: any[] = [];

  constructor(private apiService: CoreApiService, public configService: ConfigService, private localStorageService: LocalStorageService,
              protected commonDataService: CommonDataService) {
    this.userId = this.localStorageService.get('user')?.UserId;
    this.vipLevel = this.localStorageService.get('user')?.VipLevel;
    this.partners = this.commonDataService.partners;
  }

  ngOnInit(): void {
    this.getPartnerVipLevels();
  }

  onPartnerChange(value) {
    this.partnerId = value;
    this.getPartnerVipLevels();
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    }
  }

  resetProgress(): void {
    this.currentStep = 0;
  }

  getStepClasses(index: number): string {
    if (index <= this.vipLevel) {
      return 'step-active';
    } else {
      return 'step-inactive';
    }
  }

  getPercentageClasses(index: number): string {
    if (index <= this.vipLevel) {
      return 'percentage-circle-active';
    } else {
      return 'percentage-circle-inactive';
    }
  }

  about(index: number) {
    this.openedAboutSections.forEach((state, i) => {
      if (i !== index) {
        this.openedAboutSections[i] = false;
      }
    });
    this.openedAboutSections[index] = !this.openedAboutSections[index];
  }

  close() {
    const index = this.openedAboutSections.findIndex(state => state === true);
    if (index !== -1) {
      this.openedAboutSections[index] = false;
    }
  }

  getPartnerVipLevels() {
    this.filter.PartnerId = this.partnerId;
    this.apiService.apiPost(this.configService.getApiUrl, this.filter, true,
      Controllers.PARTNER, Methods.GET_VIP_LEVELS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.openedVip = true;
        this.partnerVipLevels = data.ResponseObject;
      }
    });
  }

}
