import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientRoutingModule} from "./client-routing.module";
import {ClientComponent} from "./client.component";
import {MatTabsModule} from "@angular/material/tabs";
import {DocumentTypesResolver} from "../../resolvers/document-types.resolver";
import {ClientStatesResolver} from "../../resolvers/client-states.resolver";
import {ClientCategoryResolver} from "../../resolvers/client-category.resolver";
import {StateService} from "../../services/state.service";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ClientComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  providers:[
    DocumentTypesResolver,
    ClientCategoryResolver,
    ClientStatesResolver,
    StateService
  ]
})
export class ClientModule
{

}
