import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  filmName: string;
  itineraryName: string;
  options: string[];
  films: string[];
  filmsLocations: FilmLocation[];
  selectedFilmLocations: Waypoint[];
  itineraryInfo: Waypoint[];
  filteredOptions: Observable<string[]>;
  customFormCtrl: FormControl;
  faHome: IconDefinition;
  faSearch: IconDefinition;
  faTrashAlt: IconDefinition;
  faMapMarker: IconDefinition;

  constructor(private filmLocationService:FilmLocationService, private mapService: MapService, private itineraryService:ItineraryService, private router: Router) { }

  ngOnInit(): void {
    if(!this.itineraryService.itinerary) {
      this.router.navigate(['/home']);
    }
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.films.filter(option => option.toLowerCase().includes(filterValue));
  }

  getAllLocations() {
    this.filmName = this.customFormCtrl.value;
    let filmObjs = this.filmsLocations.filter(fl => this.customFormCtrl.value === fl.title);
    if(filmObjs.length > 0) {
      let isAddrAvailable = filmObjs.reduce((acc, pilot) => { return acc && pilot.hasOwnProperty('locations'); }, true);
      if(isAddrAvailable) {
        let selectedAddresses = filmObjs.map(data => data.locations);
        selectedAddresses = [...new Set(selectedAddresses)];
        for(let selectedAddress of selectedAddresses) {
          let wp = new Waypoint();
          wp.filmTitle = this.filmName;
          wp.filmAddress = selectedAddress;
          wp.mapObj = null;
          this.filmLocationService.currentFilmWaypoints.push(wp);
        }
        this.selectedFilmLocations = this.filmLocationService.currentFilmWaypoints;
        for(let loc of this.filmLocationService.currentFilmWaypoints) {
          this.mapService.createWaypointOnMap(loc, Config.MARKER.COLOR.RED);
        }
      } else {
        alert(Config.LABELS.ERROR.NO_LOCATIONS_FOUND);
      }
    }
  }

  drop(event: CdkDragDrop<Waypoint[]>) {
    moveItemInArray(this.itineraryInfo, event.previousIndex, event.currentIndex);
    this.updateItineraryInfo(Config.EVENTS.REORDER_WAYPOINT);
  }

  updateItineraryInfo(event) {
    if(event === Config.EVENTS.ADD_WAYPOINT) {
      this.itineraryInfo = this.itineraryService.itinerary.itineraryInfo;
      this.mapService.createMapForItinerary(this.itineraryInfo);
    } else if (event === Config.EVENTS.REMOVE_WAYPOINT) {
      this.itineraryService.itinerary.itineraryInfo = this.itineraryInfo;
    }
  }

  saveItinerary() {
    this.itineraryService.saveItinerary();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

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
        this.mapService.createWaypointOnMap(val, Config.MARKER.COLOR.RED);
      });
    }
    this.mapService.createMapForItinerary(this.itineraryInfo);
  }

  disableSaveButton() {
    return this.itineraryService.itinerary.itineraryStatus === Config.IT_STATUS_SAVED;
  }

}
