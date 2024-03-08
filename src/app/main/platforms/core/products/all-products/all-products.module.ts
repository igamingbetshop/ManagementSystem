import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';

import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { FilterOptionsResolver } from '../../resolvers/filter-options.resolver';
import { DropdownDirective } from 'src/app/core/directives/dropdown.directive';
import { AllProductsComponent } from './all-products.component';

const routes: Routes = [
  {
    path: '',
    component: AllProductsComponent,
    children: [
      {
        path: 'product',
        loadChildren: () => import('../product/product.module').then(m => m.ProductModule),
        resolve:{filterData:FilterOptionsResolver},
      },
    ]
  }
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
    DropdownDirective,
    MatMenuModule
  ],
  declarations: [AllProductsComponent]
})
export class AllProductsModule { }
