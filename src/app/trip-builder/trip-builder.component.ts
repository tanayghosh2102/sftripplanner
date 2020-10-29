import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';

import { faHome, faSearch, faTrashAlt, faMapMarker, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { FilmLocationService } from '../film-location.service';
import { FilmLocation } from '../film-location';
import { Waypoint } from '../waypoint';
import { Config } from '../configuration';
import { MapService } from '../map.service';
import { ItineraryService } from '../itinerary.service';

@Component({
  selector: 'app-trip-builder',
  templateUrl: './trip-builder.component.html',
  styleUrls: ['./trip-builder.component.scss']
})
export class TripBuilderComponent implements OnInit {
  filmName: string; // Bound to View element to display selected Film name.
  itineraryName: string; // Bound to the View elemnt to display name of the itinerary
  options: string[]; // Bound to View to the auto complete field to display all the movies.
  films: string[]; // Used to maintain all the films names.
  filmsLocations: FilmLocation[]; // Used to store the data recieved from the URL.
  selectedFilmLocations: Waypoint[]; // Bound to View, used to store the locations of the film selected.
  itineraryInfo: Waypoint[]; // Bound to View, used to store the locations added to the itinerary.
  customFormCtrl: FormControl; // From control for the auto complete field.
  faHome: IconDefinition; // Fontawesome Icon definition used in the View.
  faSearch: IconDefinition; // Fontawesome Icon definition used in the View.
  faTrashAlt: IconDefinition; // Fontawesome Icon definition used in the View.
  faMapMarker: IconDefinition; // Fontawesome Icon definition used in the View.

  constructor(private filmLocationService:FilmLocationService, private mapService: MapService, private itineraryService:ItineraryService, private router: Router) { }

  /** Initializes all the instance variables and sets up all the data that is required for the Component. */
  ngOnInit(): void {
    if(!this.itineraryService.itinerary) {
      this.router.navigate(['/home']);
    } else {
      this.customFormCtrl = new FormControl();
      this.faHome = faHome;
      this.faSearch = faSearch;
      this.faTrashAlt = faTrashAlt;
      this.faMapMarker = faMapMarker;
      this.itineraryName = this.itineraryService.itinerary.itineraryName;
      this.selectedFilmLocations = [];
      this.itineraryInfo = this.itineraryService.itinerary.itineraryInfo;
      this.filmLocationService.getAllFilmLocations().subscribe((data) => {
        this.filmsLocations = data;
        let filmList = new Set<string>();
        for(let filmLoc of data) {
          filmList.add(filmLoc.title);
        }
        this.films = Array.from(filmList);
      });
      this.customFormCtrl.valueChanges.subscribe(entry => {
        this.options = this._filter(entry);
      });
    }
  }

  /** Filter the films based on the text entered in the Film name input field. */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.films.filter(option => option.toLowerCase().includes(filterValue));
  }

  /** Clears all markers on the Map. */
  clearAllMarkersOnMap() {
    this.filmLocationService.currentFilmWaypoints.forEach((val) => {
      val.mapObj.markerObj.setMap(null);
    })
  }

  /** Gets all location for the film that was selected and displays them on the trip builder panel and the map. */
  getAllLocations() {
    this.clearAllMarkersOnMap();
    this.filmName = this.customFormCtrl.value;
    this.filmLocationService.currentFilmWaypoints = [];
    // All locations for the entered film.
    let filmObjs = this.filmsLocations.filter(fl => this.customFormCtrl.value === fl.title);
    if(filmObjs.length > 0) {
    // Checks if the film objects has a 'location' property.
    filmObjs = filmObjs.filter(fl => fl.hasOwnProperty('locations'));
      if(filmObjs.length > 0) {
        // Retrieving only addresses form the objects.
        let selectedAddresses = filmObjs.map(data => data.locations);
        // Removing duplicate addresses.
        selectedAddresses = [...new Set(selectedAddresses)];
        // Waypoint object created for all addresses.
        for(let selectedAddress of selectedAddresses) {
          let wp = new Waypoint();
          wp.filmTitle = this.filmName;
          wp.filmAddress = selectedAddress;
          wp.mapObj = null;
          this.filmLocationService.currentFilmWaypoints.push(wp);
        }
        this.selectedFilmLocations = this.filmLocationService.currentFilmWaypoints;
        // Create a marker on the map for all the waypoints.
        for(let loc of this.filmLocationService.currentFilmWaypoints) {
          this.mapService.createWaypointOnMap(loc, Config.MARKER.COLOR.BLUE);
        }
      } else {
        alert(Config.LABELS.ERROR.NO_LOCATIONS_FOUND);
      }
    }
  }

  /** Drag-drop event listener for the DragDrop Itinerary List. */
  drop(event: CdkDragDrop<Waypoint[]>) {
    moveItemInArray(this.itineraryInfo, event.previousIndex, event.currentIndex);
    this.updateItineraryInfo(Config.EVENTS.REORDER_WAYPOINT);
  }

  /** Updates the itinerary information in the service and the map. */
  updateItineraryInfo(event) {
    if(event === Config.EVENTS.ADD_WAYPOINT) {
      this.itineraryInfo = this.itineraryService.itinerary.itineraryInfo;
      this.mapService.createMapForItinerary(this.itineraryInfo);
    } else if (event === Config.EVENTS.REMOVE_WAYPOINT) {
      this.itineraryService.itinerary.itineraryInfo = this.itineraryInfo;
    }
  }

  /** Click listener for save itinerary button */
  saveItinerary() {
    this.itineraryService.saveItinerary();
  }

  /** Click Listener for the home button. */
  goToHome() {
    this.router.navigate(['/home']);
  }

  /** Removes a location from the service object and the map. */
  removeLocation(wp: Waypoint) {
    if(this.itineraryService.itinerary.itineraryStatus === Config.IT_STATUS_SAVED) {
      this.itineraryService.itinerary.itineraryStatus = Config.IT_STATUS_EDIT;
    }
    for(let i = 0; i < this.itineraryInfo.length; i++) {
      if(wp.filmAddress === this.itineraryInfo[i].filmAddress) {
        this.itineraryInfo.splice(i, 1);
        break;
      }
    }
    this.updateItineraryInfo(Config.EVENTS.REMOVE_WAYPOINT);
    if(this.selectedFilmLocations.length > 0) {
      this.selectedFilmLocations.push(wp);
      this.selectedFilmLocations.forEach(val => {
        this.mapService.createWaypointOnMap(val, Config.MARKER.COLOR.BLUE);
      });
    }
    this.mapService.createMapForItinerary(this.itineraryInfo);
  }

  /** Checks if the save itinerary button should be disabled. */
  disableSaveButton() {
    return this.itineraryService.itinerary.itineraryStatus === Config.IT_STATUS_SAVED;
  }

}
