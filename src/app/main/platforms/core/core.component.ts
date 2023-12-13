import {Component} from "@angular/core";

@Component({
  selector: 'app-core',
  template: `
    <router-outlet></router-outlet>
    <app-quick-find></app-quick-find>
  `,
})
export class CoreComponent
{
}
