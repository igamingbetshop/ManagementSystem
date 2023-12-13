import {RouterModule, Routes} from "@angular/router";
import {BannerComponent} from "./banner.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";


const routes: Routes = [
  {
    path: '',
    component: BannerComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [BannerComponent],
})
export class BannerModule {
}
