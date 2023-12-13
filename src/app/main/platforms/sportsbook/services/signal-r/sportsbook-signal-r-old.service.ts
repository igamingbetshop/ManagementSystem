import {EventEmitter, Injectable, Injector} from '@angular/core';
import {ConfigService} from "../../../../../core/services";
import {SportsbookSignalRService} from "./sportsbook-signal-r.service";
declare var $: any;

@Injectable()
export class SportsBookSignalROldService extends SportsbookSignalRService{
  public hubConnection: any;
  public reconnectPromise: any;


  constructor(
    private configService: ConfigService
  ) {
    super();
  }

  init() {
    const url = `${this.configService.getSBApiUrl}/` + 'api/signalr/reporthub';

    this.hubConnection = $.hubConnection(url, {useDefaultPath: false});
    this.connection = this.hubConnection.createHubProxy('reporthub');
    this.startSocket();
  }

  private startSocket() {
    this.hubConnection.start()
      .done(() => {

    }).fail((error) => {
      console.error(error.toString());
    });

    this.hubConnection.stateChanged((state) => {
      if(state.newState == ConnectionState.Connected && state.oldState == ConnectionState.Disconnected) {
        this.notifyReConnection$.next(false);
      } else if(state.newState == ConnectionState.Disconnected && state.oldState == ConnectionState.Connected) {
        this.notifyReConnection$.next(true);
      }
    });

  }

  stop() {
    this.hubConnection.stop();
  }
}


export enum ConnectionState {
  Connected = 1,
  Disconnected = 2
}
