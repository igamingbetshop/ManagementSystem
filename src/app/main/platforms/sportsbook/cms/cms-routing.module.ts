import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { CmsComponent } from './cms.component';



const routes: Routes = [

  {
    path:'',
    component:CmsComponent,
    children:[
      {
        path: 'translations',
        loadChildren: () => import('./translations/translations.module').then(m => m.SportsbookTranslationsModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'banners',
        loadChildren: () => import('./banners/banners.module').then(m => m.BannersModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: 'banner',
        loadChildren: () => import('./banners/banner/banner.module').then(m => m.BannerModule),
        resolve:{filterData:SportFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'quick-Links',
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
