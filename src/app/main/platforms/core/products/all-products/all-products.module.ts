import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllProductsComponent } from './all-products.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgBooleanFilterModule } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.module';
import { AgGridModule } from 'ag-grid-angular';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { FilterOptionsResolver } from '../../resolvers/filter-options.resolver';

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
    AgGridModule
  ],
  declarations: [AllProductsComponent]
})
export class AllProductsModule { }
