import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { FilmLocationService } from '../film-location.service';
import { ItineraryService } from '../itinerary.service';
import { MapService } from '../map.service';

import { FilmLocation } from '../film-location';
import { Config } from '../configuration';
import { Itinerary } from '../itinerary';

@Component({
  selector: 'app-trip-planner',
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.scss']
})
export class TripPlannerComponent implements AfterViewInit {

  @ViewChild('map') mapElement: any; // HTMElement from the view.
  data: FilmLocation[]; // Bound to the view, stores all film locations.
  
  constructor(private filmLocationService: FilmLocationService, private itineraryService: ItineraryService, private mapService: MapService) { }

  /** Initializes all the instance variables and sets up all the data that is required for the Component. */
  ngAfterViewInit(): void {
    // Requesting all the film locations from the URL.
    this.filmLocationService.getAllFilmLocations().subscribe((data: any) => {
      this.data = data;
    });
    // Intialize the map for the view.
    this.mapService.initMap(this.mapElement.nativeElement);
    // In case of editing previous itinerary, render the it on the map.
    if(this.itineraryService.itinerary.itineraryStatus === Config.IT_STATUS_EDIT) {
      this.mapService.createMapForItinerary(this.itineraryService.itinerary.itineraryInfo);
    }
  }
}
