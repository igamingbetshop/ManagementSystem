import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RouteTabItem } from "../../../../../core/interfaces";
import { ApiService, ConfigService } from "../../../../../core/services";

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
})
export class PartnerComponent implements OnInit {
  tabs: RouteTabItem[] = [
    {
      label: 'Clients.Main',
      route: 'main'
    },
    {
      label: 'Clients.PaymentSettings',
      route: 'payment-settings'
    },
    {
      label: 'Partners.ProductSettings',
      route: 'product-settings'
    },
    {
      label: 'Partners.CurrencySettings',
      route: 'currency-settings'
    },
    {
      label: 'Partners.LanguageSettings',
      route: 'language-settings'
    },
    {
      label: 'Clients.ProviderSettings',
      route: 'provider-settings'
    },
    {
      label: 'Clients.ProductLimits',
      route: 'product-limits'
    },
    {
      label: 'Partners.PaymentLimits',
      route: 'payment-limits'
    },
    {
      label: 'Partners.ComplimentaryPointRates',
      route: 'complimentary-point-rates'
    },
    {
      label: 'Partners.PaymentInfo',
      route: 'payment-info'
    },
    {
      label: 'Partners.CountrySettings',
      route: 'country-settings'
    },
    {
      label: 'Partners.WebSiteSettings',
      route: 'web-site-settings'
    },
    {
      label: 'Partners.Keys',
      route: 'keys'
    },
  ];
  public partnerId;
  public partnerName;

  constructor(private apiService: ApiService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
  }

  onTabClick(tab: any, event: Event) {
    event.preventDefault();
    const queryParams = { ...this.activateRoute.snapshot.queryParams };
    delete queryParams['id'];
    this.router.navigate(['/main/platform/partners/partner', tab.route], { queryParams: queryParams });
  }

}
