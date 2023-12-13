import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientsRoutingModule} from './clients-routing.module';
import { DocumentTypesResolver } from 'src/app/main/platforms/core/resolvers/document-types.resolver';
import {ClientsComponent} from "./clients.component";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonDataResolver } from '../resolvers/common-data.resolver';
import { PartnersResolver } from '../resolvers/partners.resolver';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';


@NgModule({
  declarations:[
    ClientsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    MatSnackBarModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
  ],
  providers:[
    DocumentTypesResolver,
    CommonDataResolver,
    PartnersResolver
   ]
})
export class ClientsModule {}
