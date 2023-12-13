import {RouterModule, Routes} from "@angular/router";
import {CmsComponent} from "./cms.component";
import {NgModule} from "@angular/core";
import {VirtualGamesFilterOptionsResolver} from "../resolvers/virtual-games-filter-options.resolver";

const routes: Routes = [

  {
    path: '',
    component: CmsComponent,
    children: [
      {
        path: 'translations',
        loadChildren: () => import('./translations/translations.module').then(m => m.TranslationsModule),
        resolve: {filterData: VirtualGamesFilterOptionsResolver},
      },
      {
        path: 'banners',
        loadChildren: () => import('./banners/banners.module').then(m => m.BannersModule),
        resolve: {filterData: VirtualGamesFilterOptionsResolver},
      },
      {
        path: 'banner',
        loadChildren: () => import('./banners/banner/banner.module').then(m => m.BannerModule),
        resolve: {filterData: VirtualGamesFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'translations',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CmsRoutingModule {
}
