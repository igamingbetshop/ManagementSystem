import {Observable, Subject} from "rxjs";

export abstract class SportsbookSignalRService {

  protected notifyReConnection$: Subject<boolean> = new Subject();
  reConnectionState$: Observable<boolean> = this.notifyReConnection$.asObservable();

  protected notifyConnection$: Subject<boolean> = new Subject();
  connectionState$: Observable<boolean> = this.notifyConnection$.asObservable();

  public connection: any;
  abstract init(hubName: string);
}
