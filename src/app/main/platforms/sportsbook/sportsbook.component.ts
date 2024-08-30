import {Component} from "@angular/core";

@Component({
  selector: 'app-sportsbook',
  template: `
    <router-outlet/>
    <app-quick-find/>
    <app-sb-quick-find/>
  `,
})
export class SportsbookComponent{
}
