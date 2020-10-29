import { Injectable } from '@angular/core';
import { faPray } from '@fortawesome/free-solid-svg-icons';
import { Config } from './configuration';
import { Waypoint } from './waypoint';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: google.maps.Map;
  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({preserveViewport: true});
  directionRequest: google.maps.DirectionsRequest = {};
  mapMarkers: google.maps.Marker[] = [];


  constructor() { }

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

  createWaypointOnMap(loc: Waypoint, icon: string) {
    this.geocoder.geocode({ 'address': loc.filmAddress + ", " + Config.LOCATION}, (results, status) => {
      if(status = google.maps.GeocoderStatus.OK) {
        this.map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          icon: Config.MARKER.URL + icon,
          map     : this.map,
          position: results[0].geometry.location,
          title: results[0].formatted_address,
          animation: google.maps.Animation.DROP
        });
        this.mapMarkers.push(marker);
        let mapObj = {
          geocodeObj: results[0],
          markerObj: marker
        }
        loc.mapObj = mapObj;
      }
    });
  }

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
