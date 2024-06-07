import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BannersComponent } from './banners.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [
  {
    path: '',
    component: BannersComponent,
    children: [
      {
        path: 'banner',
        loadChildren: () => import('./banner/banner.module').then(m => m.BannerModule),
        // resolve:{filterData:SportFilterOptionsResolver},
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridModule,
    MatSnackBarModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatSelectModule,
    MatButtonModule
  ],
  declarations: [BannersComponent],
  providers: [DatePipe],
})
export class BannersModule {
}
