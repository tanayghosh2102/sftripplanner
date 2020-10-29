import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { FilmLocation } from './film-location';
import { Waypoint } from './waypoint';
import { Config } from './configuration';

@Injectable({
  providedIn: 'root'
})
export class FilmLocationService {

  currentFilmWaypoints: Waypoint[] = []; // Stores the Waypoint objects for all the locations for the selected film.

  constructor(private http: HttpClient) { }

  getAllFilmLocations() {
    // HTTP request to the URL to get the data.
    return this.http.get<FilmLocation[]>(Config.DATASET_URL);
  }
}
