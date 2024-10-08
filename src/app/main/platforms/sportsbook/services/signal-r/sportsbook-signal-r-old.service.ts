import {EventEmitter, Injectable, Injector} from '@angular/core';
import {ConfigService} from "../../../../../core/services";
import {SportsbookSignalRService} from "./sportsbook-signal-r.service";
declare var $: any;

@Injectable()
export class SportsBookSignalROldService extends SportsbookSignalRService{
  hubConnection: any;

  constructor(
    private configService: ConfigService
  ) {
    super();
  }

  init(hubName: string) {
    const url = `${this.configService.getSBApiUrl}/` + `api/signalr/${hubName}`;
    this.hubConnection = $.hubConnection(url, {useDefaultPath: false});
    this.connection = this.hubConnection.createHubProxy(hubName);
    this.startSocket();
  }

  private startSocket() {
    this.hubConnection.start()
      .done(() => {
        this.notifyConnection$.next(true);
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

  sendMessage(methodName: string,  ...args: any[]) {
    return this.connection.invoke(methodName, ...args);
  }
}


export enum ConnectionState {
  Connected = 1,
  Disconnected = 2
}
