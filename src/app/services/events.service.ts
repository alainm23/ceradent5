import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private user_login_subject = new Subject<any> ();
  private fooSubject = new Subject<any> ();

  private rangeSubject = new Subject<any> ();
  constructor() { }

  user_login (data: any) {
    this.user_login_subject.next (data);
  }

  get_user_login (): Subject<any> {
    return this.user_login_subject;
  }

  publishSomeData (data: any) {
    this.fooSubject.next (data);
  }

  getObservable (): Subject<any> {
    return this.fooSubject;
  }

  range_changed (data: any) {
    this.rangeSubject.next (data);
  }

  get_range_changed (): Subject<any> {
    return this.rangeSubject;
  }
}
