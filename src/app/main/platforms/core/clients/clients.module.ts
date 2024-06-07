import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientsRoutingModule} from './clients-routing.module';
import { DocumentTypesResolver } from 'src/app/main/platforms/core/resolvers/document-types.resolver';
import {ClientsComponent} from "./clients.component";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonDataResolver } from '../resolvers/common-data.resolver';
import { PartnersResolver } from '../resolvers/partners.resolver';


@NgModule({
  declarations:[
    ClientsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    MatSnackBarModule,
  ],
  providers:[
    DocumentTypesResolver,
    CommonDataResolver,
    PartnersResolver
   ]
})
export class ClientsModule {}
