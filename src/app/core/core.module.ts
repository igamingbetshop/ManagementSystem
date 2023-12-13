import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  AuthService,
  ConfigService,
  CommonDataService,
  LocalStorageService,
  LoaderService,
  SidenavService,
  UtilityService,
  ApiService,
} from './services/index';
import {AuthGuard} from "./guards/auth-guard";
import {SearchService} from "./services/search.sevice";

const Services = [
  AuthService,
  ConfigService,
  CommonDataService,
  LocalStorageService,
  LoaderService,
  SidenavService,
  SearchService,
  UtilityService,
  AuthGuard,
  ApiService

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    ...Services
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You should import core module only in the root module');
    }
  }

}
