import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { faPlus } from '@fortawesome/free-solid-svg-icons'
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

  faPlus = faPlus;

  constructor(private filmLocationService: FilmLocationService, private itineraryService: ItineraryService) { }

  currentFilmWaypoints: Waypoint[];
  @Input() filmName: string;
  @Output() addWPEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.currentFilmWaypoints = this.filmLocationService.currentFilmWaypoints;
  }

  clearMarkerAnimation() {
    this.currentFilmWaypoints.forEach(value => {
      value.mapObj.markerObj.setAnimation(null);
    })
  }

  highlightMarker(wp: Waypoint) {
    this.clearMarkerAnimation();
    wp.mapObj.markerObj.setAnimation(google.maps.Animation.BOUNCE);
  }

  addWaypointToItinerary(wp: Waypoint) {
    wp.mapObj.markerObj.setMap(null);
    this.removeFromLocationList(wp);
    if(!this.checkIfWaypointExists(wp)) {
      if(this.itineraryService.itinerary.itineraryStatus === Config.IT_STATUS_SAVED) {
        this.itineraryService.itinerary.itineraryStatus = Config.IT_STATUS_EDIT;
      }
      this.itineraryService.itinerary.itineraryInfo.push(wp);
      this.addWPEvent.emit(Config.EVENTS.ADD_WAYPOINT);
    } else {
      alert("Location already exists in the itinerary!");
    }
  }

  removeFromLocationList(wp: Waypoint) {
    let length = this.filmLocationService.currentFilmWaypoints.length;
    for(let i = 0; i < length; i++) {
      if(this.filmLocationService.currentFilmWaypoints[i].filmAddress === wp.filmAddress) {
        this.filmLocationService.currentFilmWaypoints.splice(i, 1);
        break;
      }
    }
  }

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
