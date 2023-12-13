import {Subject} from "rxjs";

export abstract class SportsbookSignalRService {

  protected notifyReConnection$: Subject<boolean> = new Subject();
  public reConnectionState$ = this.notifyReConnection$.asObservable();

  public connection: any;
  abstract init();
}
