import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { FilmLocation } from './film-location';
import { Waypoint } from './waypoint';

@Injectable({
  providedIn: 'root'
})
export class FilmLocationService {

  currentFilmWaypoints: Waypoint[] = [];

  constructor(private http: HttpClient) { }

  getAllFilmLocations() {
    return this.http.get<FilmLocation[]>("https://data.sfgov.org/resource/yitu-d5am.json");
  }
}
