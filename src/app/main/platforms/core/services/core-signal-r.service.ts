import {EventEmitter, Injectable} from '@angular/core';
import {ConfigService} from "../../../../core/services";
declare var $: any;

@Injectable()
export class CoreSignalRService {
  public hubConnection: any;
  public connection: any;
  public connectionEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private configService: ConfigService
  ) {
  }

  init() { 
    const url = this.configService.getApiUrl.slice(0, -4);
    this.hubConnection = $.hubConnection(url + '/signalr/signalr', {useDefaultPath: false});
    this.connection = this.hubConnection.createHubProxy('baseHub');
    this.startSocket();
  }

  startSocket() {
    this.hubConnection.start().done(() => {
        this.connectionEmitter.emit(true);
      }).fail(() => {
        this.connectionEmitter.emit(false);
      });
  }

  stop() {
    this.hubConnection.stop();
  }
}
