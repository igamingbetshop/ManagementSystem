import {Component, OnInit, ViewChild} from '@angular/core';

import 'ag-grid-enterprise';
import {ActivatedRoute} from "@angular/router";
import {AllProductsComponent} from "./componentns/all-products/all-products.component";
import {PartnerProductsComponent} from "./componentns/partner-products/partner-products.component";
import {ProductChangeHistoryComponent} from "./componentns/change-history/product-change-history.component";

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrls: ['./product-settings.component.scss']
})
export class ProductSettingsComponent implements OnInit {

  @ViewChild(AllProductsComponent) allProductsComponent:AllProductsComponent;
  @ViewChild(PartnerProductsComponent) partnerProductsComponent:PartnerProductsComponent;
  @ViewChild(ProductChangeHistoryComponent) productChangeHistoryComponent:ProductChangeHistoryComponent;
  public partnerId;
  public partnerName;
  public AllProductsState = true;
  public PartnerProductState = true;

  constructor(private activateRoute:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
  }

  allProductsOn()
  {
    this.AllProductsState = !this.AllProductsState;
  }

  partnerProductsOn() {
    this.PartnerProductState = !this.PartnerProductState;
  }

}
