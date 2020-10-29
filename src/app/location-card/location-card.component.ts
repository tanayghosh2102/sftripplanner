import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Config } from '../configuration';
import { FilmLocationService } from '../film-location.service';
import { ItineraryService } from '../itinerary.service';
import { Waypoint } from '../waypoint';

@Component({
  selector: 'app-location-card',
  templateUrl: './location-card.component.html',
  styleUrls: ['./location-card.component.scss']
})
export class LocationCardComponent implements OnInit {

  @Input() locations: Waypoint[]; //Input property for the component.
  faPlus: IconDefinition; // font awesome icon.

  @Output() addWPEvent: EventEmitter<string> = new EventEmitter<string>(); // Event emitter to notify parent component about addition of location in the itinerary.

  constructor(private filmLocationService: FilmLocationService, private itineraryService: ItineraryService) { }

  /** Initializes all the instance variables and sets up all the data that is required for the Component. */
  ngOnInit(): void {
    this.faPlus = faPlus;
    console.log(this.locations);
  }

  /** Clears animations of all markers available on the map. */
  clearMarkerAnimation() {
    this.locations.forEach(value => {
      value.mapObj.markerObj.setAnimation(null);
    })
  }

  /** Highlights the marker for the clicked Waypoint (location) on the map. */
  highlightMarker(wp: Waypoint) {
    this.clearMarkerAnimation();
    wp.mapObj.markerObj.setAnimation(google.maps.Animation.BOUNCE);
  }

  /** Adds a new location to the itinerary and updates the map accordingly. */
  addWaypointToItinerary(wp: Waypoint) {
    wp.mapObj.markerObj.setMap(null);
    this.removeFromLocationList(wp);
    if(!this.checkIfWaypointExists(wp)) {
      if(this.itineraryService.itinerary.itineraryStatus === Config.IT_STATUS_SAVED) { // Checks to see the status of the itinerary to avoid duplicate itinerary objects in the storage object.
        this.itineraryService.itinerary.itineraryStatus = Config.IT_STATUS_EDIT;
      }
      this.itineraryService.itinerary.itineraryInfo.push(wp);
      this.addWPEvent.emit(Config.EVENTS.ADD_WAYPOINT);
    } else {
      alert("Location already exists in the itinerary!");
    }
  }

  /** Removes the location received in the parameter from the location list. */
  removeFromLocationList(wp: Waypoint) {
    let length = this.filmLocationService.currentFilmWaypoints.length;
    for(let i = 0; i < length; i++) {
      if(this.filmLocationService.currentFilmWaypoints[i].filmAddress === wp.filmAddress) {
        this.filmLocationService.currentFilmWaypoints.splice(i, 1);
        break;
      }
    }
  }

  /** Checks if location exists in the itinerary. */
  checkIfWaypointExists(wp: Waypoint): boolean {
    let flag = false;
    for(let waypoint of this.itineraryService.itinerary.itineraryInfo) {
      if(wp.filmAddress === waypoint.filmAddress) {
        flag = true;
        break;
      }
    }
    return flag;
  }

}
