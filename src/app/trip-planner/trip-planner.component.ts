import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

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
export class TripPlannerComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapElement: any;
  data: FilmLocation[];
  
  constructor(private filmLocationService: FilmLocationService, private itineraryService: ItineraryService, private mapService: MapService) { }

  ngAfterViewInit(): void {
    this.filmLocationService.getAllFilmLocations().subscribe((data: any) => {
      this.data = data;
    });
    this.mapService.initMap(this.mapElement.nativeElement);
    if(this.itineraryService.itinerary.itineraryStatus === Config.IT_STATUS_EDIT) {
      this.mapService.createMapForItinerary(this.itineraryService.itinerary.itineraryInfo);
    }
  }

  ngOnInit(): void {
    
  }
}
