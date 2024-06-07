import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CoreBannersComponent } from './core-banners.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const routes: Routes = [
  {
    path: '',
    component: CoreBannersComponent,
    children: [
      {
        path: 'banner',
        loadChildren: () => import('../core-banners/core-banner/core-banner.module').then(m => m.CoreBannerModule),
      },
    ]

  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
  declarations: [CoreBannersComponent],
  providers: [DatePipe],
})
export class CoreBannersModule { }
