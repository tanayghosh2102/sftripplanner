import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';

import { ItineraryService } from './itinerary.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private itineraryService: ItineraryService) {}

  ngOnInit():void {
    this.itineraryService.initItineraryLocalStorage();
  }

}
