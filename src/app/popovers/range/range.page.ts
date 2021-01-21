import { Component, OnInit, Input } from '@angular/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-range',
  templateUrl: './range.page.html',
  styleUrls: ['./range.page.scss'],
})
export class RangePage implements OnInit {
  @Input () value: number = 1;
  @Input () icon: number = 1;
  constructor (private events: EventsService) { }

  ngOnInit() {
  }

  changed (event: any) {
    this.events.range_changed ({tipo: this.icon, value: event });
  }
}
