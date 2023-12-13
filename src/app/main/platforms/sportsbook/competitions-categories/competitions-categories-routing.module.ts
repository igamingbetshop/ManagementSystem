import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { CompetitionsCategoriesComponent } from './competitions-categories.component';

const routes: Routes = [

  {
    path:'',
    component:CompetitionsCategoriesComponent,
    children:[
      {
        path: 'competition-category',
        loadChildren: () => import('./competition-category/competition-category.module').then(m => m.CompetitionCategoryModule)
      },
      {
        path: 'all-competitions-categories',
        loadChildren: () => import('./all-competitions-categories/all-competitions-categories.module').then(m => m.AllCompetitionsCategoriesModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-competitions-categories',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompetitionsCategoriesRoutingModule
{

}
