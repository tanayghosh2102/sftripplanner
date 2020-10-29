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

  /** Initializes all the instance variables and sets up all the data that is required for the Component. */
  ngOnInit():void {
    // Gets the persisted object from local storage.
    this.itineraryService.initItineraryLocalStorage();
  }

}
