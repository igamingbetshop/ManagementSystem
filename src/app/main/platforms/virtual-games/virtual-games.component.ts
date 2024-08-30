import { Component } from "@angular/core";

@Component({
  selector: 'app-virtual-games',
  template: `
    <router-outlet/>
    <app-quick-find/>
    @if(isSportsbook) {
      <app-sb-quick-find/>
    }
  `,
})
export class VirtualGamesComponent {
  isSportsbook = JSON.parse(localStorage.getItem('adminMenu')).findIndex((item) => item.Name === 'Sportsbook') !== -1;
}
