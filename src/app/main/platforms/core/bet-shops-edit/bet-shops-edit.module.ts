import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetShopsEditComponent } from './bet-shops-edit.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { CommonDataResolver } from '../resolvers/common-data.resolver';
import { PartnersResolver } from '../resolvers/partners.resolver';

const routes: Routes = [
  {
    path: '',
    component: BetShopsEditComponent,
    children: [
      {
        path: 'bet-shops',
        loadChildren: () => import('../bet-shops/bet-shops.module').then(m => m.BetShopsModule),
         resolve: {commonData: CommonDataResolver, partners: PartnersResolver},
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    TranslateModule,
    AgGridModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterModule.forChild(routes),
  ],
  declarations: [BetShopsEditComponent]
})
export class BetShopsEditModule { }
