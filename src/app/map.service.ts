import { Injectable } from '@angular/core';

import { Config } from './configuration';
import { Waypoint } from './waypoint';
import { FilmLocationService } from './film-location.service';
import { faWpbeginner } from '@fortawesome/free-brands-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: google.maps.Map; // Google Map API object. Used to create a map for the view.
  geocoder = new google.maps.Geocoder(); // Google Geocoder API object. Used to interact with the map object.
  directionsService = new google.maps.DirectionsService(); // Google Directions API class to generate directions.
  directionsRenderer = new google.maps.DirectionsRenderer({preserveViewport: true}); // Google Directions API class to render directions on map.
  directionRequest: google.maps.DirectionsRequest = {}; // Google Directions API interface for the request options object for the direction renderer.


  constructor(private filmLocationService: FilmLocationService) { }

  /** Initialize and render the google map on the view. */
  initMap(mapElement: Element) {
    // Initialize the Google Map object.
    this.map = new google.maps.Map(mapElement, Config.MAP_PROPERTIES);

    // Using Geocoding API to center on SF by default when the Trip Planner page is opened.
    this.geocoder.geocode({ 'address': Config.LOCATION}, (results, status) => {
      if(status = google.maps.GeocoderStatus.OK) {
        this.map.setCenter(results[0].geometry.location);
      }
    });
  }

  /** Creates a Waypoint and renders it on the map. */
  createWaypointOnMap(loc: Waypoint, icon: string) {
    this.geocoder.geocode({ 'address': loc.filmAddress + ", " + Config.LOCATION}, (results, status) => {
      if(status === google.maps.GeocoderStatus.OK && results) {
        this.map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          icon: Config.MARKER.URL + icon,
          map     : this.map,
          position: results[0].geometry.location,
          title: results[0].formatted_address,
          animation: google.maps.Animation.DROP
        });
        let mapObj = {
          geocodeObj: results[0],
          markerObj: marker
        }
        loc.mapObj = mapObj;
      } else {
        for(let i = 0; i < this.filmLocationService.currentFilmWaypoints.length; i++) {
          let wp = this.filmLocationService.currentFilmWaypoints[i];
          if(loc.filmTitle === wp.filmTitle && loc.filmAddress === wp.filmAddress) {
            this.filmLocationService.currentFilmWaypoints.splice(i,1);
          }
        }
      }
    });
  }

  /** Creates and renders the trip direction on the map. */
  createMapForItinerary(itineraryInfo: Waypoint[]) {
    if(itineraryInfo.length > 0) {
      this.directionsRenderer.setMap(this.map);
      this.directionRequest = this.getDirectionRequestObj(itineraryInfo);
      this.directionsService.route(this.directionRequest, (results, status) => {
        if(status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(results);
        }
      });
    }
  }

  /** Creates the DirectionRequest object for the DirectionRenderer request. */
  getDirectionRequestObj(itineraryInfo): google.maps.DirectionsRequest {
    let directionRequest: google.maps.DirectionsRequest = {};
    directionRequest.origin = itineraryInfo[0].filmAddress + ", " + Config.LOCATION;
    directionRequest.destination = itineraryInfo[itineraryInfo.length - 1].filmAddress + ", " + Config.LOCATION;
    directionRequest.provideRouteAlternatives = false;
    directionRequest.travelMode = google.maps.TravelMode.DRIVING;
    let d = new Date();
    d.toLocaleString('en-US', { timeZone: 'America/New_York' });
    directionRequest.drivingOptions = {
      departureTime: d,
      trafficModel: google.maps.TrafficModel.PESSIMISTIC
    }
    directionRequest.unitSystem = google.maps.UnitSystem.IMPERIAL;
    if(itineraryInfo.length > 2) {
      directionRequest.waypoints = [];
      for(let i = 1; i <= itineraryInfo.length - 2; i++) {
        directionRequest.waypoints.push({
          location: itineraryInfo[i].filmAddress + ", " + Config.LOCATION,
          stopover: true
        });
      }
    }
    return directionRequest;
  }
}
