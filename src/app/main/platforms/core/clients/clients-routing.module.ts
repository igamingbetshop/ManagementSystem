import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { DocumentTypesResolver } from 'src/app/main/platforms/core/resolvers/document-types.resolver';
import {ClientsComponent} from "./clients.component";
import { CommonDataResolver } from '../resolvers/common-data.resolver';
import { PartnersResolver } from '../resolvers/partners.resolver';

const routes: Routes = [

  {
    path:'',
    component:ClientsComponent,
    children:[
      {
        path: 'all-clients',
        loadChildren: () => import('./all-clients/all-clients.module').then(m => m.AllClientsModule),
        resolve:{
          documentTypes:DocumentTypesResolver,
          commonData: CommonDataResolver, partners: PartnersResolver
        }
      },
      {
        path: '',
        redirectTo: 'all-clients',
        pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule
{

}
