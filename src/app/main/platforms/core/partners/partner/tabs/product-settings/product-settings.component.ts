import {Component, OnInit, ViewChild} from '@angular/core';

import 'ag-grid-enterprise';
import {ActivatedRoute} from "@angular/router";
import {AllProductsComponent} from "./componentns/all-products/all-products.component";
import {PartnerProductsComponent} from "./componentns/partner-products/partner-products.component";
import {ProductChangeHistoryComponent} from "./componentns/change-history/product-change-history.component";
import { MatDialog } from '@angular/material/dialog';
import { ModalSizes } from 'src/app/core/enums';
import { take } from 'rxjs';

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

  constructor(
    private activateRoute:ActivatedRoute,
    public dialog: MatDialog,
  ) {
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

  async onCopySettings() {
    const { CopySettingsComponent } = await import('../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.SMALL,
      data: {
        lable: "Copy Product Settings",
        method: "COPY_PARTNER_PRODUCT_SETTING",
        controler: "PRODUCT",
        partnerId: this.partnerId
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.allProductsComponent.getCurrentPage();
        this.partnerProductsComponent.getCurrentPage();
      }
    });

  }

}
