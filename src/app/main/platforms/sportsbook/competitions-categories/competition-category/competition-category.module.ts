import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetitionCategoryComponent } from './competition-category.component';
import { CompetitionCategoryRoutingModule } from './competition-category-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    CompetitionCategoryRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [CompetitionCategoryComponent]
})
export class CompetitionCategoryModule { }
