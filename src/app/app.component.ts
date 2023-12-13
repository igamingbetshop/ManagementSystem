import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfigService} from './core/services';
import {CommonDataService} from './core/services';
import {LicenseManager} from "ag-grid-enterprise";

LicenseManager.setLicenseKey("CompanyName=IQ Soft,LicensedApplication=ManagementSystem,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-017626,ExpiryDate=28_July_2022_[v2]_MTY1ODk2MjgwMDAwMA==08c7cc414ff265d94359f530d45c1857");
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  favIcon: HTMLLinkElement = document.querySelector('#favicon');

  constructor(
    public translate: TranslateService,
    public configService: ConfigService,
    public sharedService: CommonDataService
  ) {
    this.setPartnerFavicon();
    translate.addLangs(this.configService.langList);

    const language = localStorage.getItem('lang') || 'en';
    translate.setDefaultLang(language);
    localStorage.setItem('lang', language);
    this.sharedService.setLanguage$.subscribe((lang) => {
      localStorage.setItem('lang', lang);
      translate.use(lang);
    });
    translate.use(language.match(/en|ru|zh/) ? language : 'en');
  }

  setPartnerFavicon() {
    const imagePath = "assets/images/" + window.location.hostname + "/favicon.ico";

    let image = new Image();

    image.onload = () => {
      this.favIcon.href = imagePath;
    };
    image.onerror = () => {
      this.favIcon.href = 'assets/images/favicon.ico';
    };
    image.src = imagePath;
  }
}
