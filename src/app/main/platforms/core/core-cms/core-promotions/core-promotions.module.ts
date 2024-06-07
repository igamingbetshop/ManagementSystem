import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CorePromotionsComponent } from './core-promotions.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PromotionChildsComponent } from './promotion-childs/promotion-childs.component';

const routes: Routes = [
  {
    path: '',
    component: CorePromotionsComponent,
    children: [
      {
        path: 'promotion',
        loadChildren: () => import('../core-promotions/core-promotion/core-promotion.module').then(m => m.CorePromotionModule),
      },
    ]
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    AgBooleanFilterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridModule

  ],
  declarations: [CorePromotionsComponent, PromotionChildsComponent],
  providers: [DatePipe],
})
export class CorePromotionsModule { }
