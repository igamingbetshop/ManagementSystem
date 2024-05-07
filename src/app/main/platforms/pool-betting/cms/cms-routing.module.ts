import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

// import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { CmsComponent } from './cms.component';



const routes: Routes = [

  {
    path:'',
    component:CmsComponent,
    children:[
      {
        path: 'banners',
        loadChildren: () => import('./banners/banners.module').then(m => m.BannersModule),
        // resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'banners',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule
{

}
