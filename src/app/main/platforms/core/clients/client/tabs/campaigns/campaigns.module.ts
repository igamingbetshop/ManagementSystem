import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {AgGridModule} from "ag-grid-angular";
import {CampaignsComponent} from "./campaigns.component";
import {MatButtonModule} from "@angular/material/button";

import {AddCampaignComponent} from './add-campaign/add-campaign.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";

import {ReactiveFormsModule} from "@angular/forms";
import {CampaignComponent} from './campaign/campaign.component';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: CampaignsComponent
  },
  {
    path: ':id',
    component: CampaignComponent
  }
];

@NgModule({
  declarations: [CampaignsComponent, AddCampaignComponent, CampaignComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  providers: [DatePipe]
})
export class CampaignsModule {

}
