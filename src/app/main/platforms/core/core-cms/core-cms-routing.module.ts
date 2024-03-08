import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonDataResolver, FilterOptionsResolver} from 'src/app/core/services';
import {CoreCmsComponent} from './core-cms.component';


const routes: Routes = [

  {
    path: '',
    component: CoreCmsComponent,
    children: [
      {
        path: 'banners',
        loadChildren: () => import('./core-banners/core-banners.module').then(m => m.CoreBannersModule),
        resolve: {filterData: FilterOptionsResolver, commonData: CommonDataResolver},
      },
      {
        path: 'banner',
        loadChildren: () => import('./core-banners/core-banner/core-banner.module').then(m => m.CoreBannerModule),
        resolve: {filterData: FilterOptionsResolver, commonData: CommonDataResolver},
      },
      {
        path: 'promotions',
        loadChildren: () => import('./core-promotions/core-promotions.module').then(m => m.CorePromotionsModule),
        resolve: {filterData: FilterOptionsResolver, commonData: CommonDataResolver},
      },
      {
        path: 'news',
        loadChildren: () => import('./core-news/core-news.module').then(m => m.CoreNewsModule),
        resolve: {filterData: FilterOptionsResolver, commonData: CommonDataResolver},
      },
      {
        path: 'comment-types',
        loadChildren: () => import('./core-comment-types/core-comment-types.module').then(m => m.CoreCommentTypesModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'job-areas',
        loadChildren: () => import('./core-job-areas/core-job-areas.module').then(m => m.CoreJobAreasModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'translations',
        loadChildren: () => import('./translations/translations.module').then(m => m.TranslationsModule),
        resolve: {commonData: CommonDataResolver, filterData: FilterOptionsResolver},
      },

      {
        path: 'enumerations',
        loadChildren: () => import('./core-enumerations/core-enumerations.module').then(m => m.CoreEnumerationsModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'regions',
        loadChildren: () => import('./core-regions/core-regions.module').then(m => m.CoreRegionsModule),
        resolve: {commonData: CommonDataResolver, filterData: FilterOptionsResolver},
      },
      {
        path: 'security-questions',
        loadChildren: () => import('./security-questions/security-questions.module').then(m => m.SecurityQuestionsModule),
        resolve: {commonData: CommonDataResolver, filterData: FilterOptionsResolver},
      },
      {
        path: 'popups',
        loadChildren: () => import('./popups/popups.module').then(m => m.PopupsModule),
        resolve: {filterData: FilterOptionsResolver, commonData: CommonDataResolver},
      },
      {
        path: '',
        redirectTo: 'banners',
        pathMatch: 'full'
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreCmsRoutingModule {

}
