import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CoreNewsComponent } from './core-news.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
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
import { NewsChildsComponent } from './news-childes/news-childs.component';

const routes: Routes = [
  {
    path: '',
    component: CoreNewsComponent,
    children: [
      {
        path: 'news',
        loadChildren: () => import('./news/news.module').then(m => m.NewsModule),
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
  declarations: [CoreNewsComponent, NewsChildsComponent],
  providers: [DatePipe],
})
export class CoreNewsModule { }
