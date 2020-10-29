import { Injectable } from '@angular/core';

import { Itinerary } from './itinerary';
import { StorageItinerary } from './storage-itinerary';
import { Config } from './configuration';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  itinerary: Itinerary;
  savedItineraries: Itinerary[];
  lsItineraryObj: StorageItinerary;

  constructor() { }

  storageAvailable(type:string):boolean {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
  }

  saveItinerary() {
    let seen = [];
    if(this.storageAvailable('localStorage')) {
      if(this.itinerary.itineraryStatus === Config.IT_STATUS_EDIT) {
        let d = new Date();
        d.toLocaleString('en-US', { timeZone: 'America/New_York' });
        this.itinerary.lastEdited = d;
        for(let i = 0; i < this.lsItineraryObj.itineraryList.length; i++) {
          if(this.itinerary.itineraryName === this.lsItineraryObj.itineraryList[i].itineraryName) {
            this.lsItineraryObj.itineraryList.splice(i, 1);
            break;
          }
        }
      }
      this.itinerary.itineraryStatus = Config.IT_STATUS_SAVED;
      this.lsItineraryObj.itineraryList.push(this.itinerary);
      window.localStorage.setItem(Config.WEB_LOCAL_STORAGE_KEY, JSON.stringify(this.lsItineraryObj, 
        (result, val) => {
          if(val !== null && typeof val === 'object') {
            if(seen.indexOf(val) >= 0) {
              return;
            }
            seen.push(val);
          }
          return val;
        }));
        alert(Config.LABELS.ITINERARY_SAVED);
    } else {
      alert(Config.LABELS.ERROR.NO_STORAGE_SUPPORT);
    }
  }

  initItineraryLocalStorage() {
    if(this.storageAvailable('localStorage')) {
      this.lsItineraryObj = <StorageItinerary> JSON.parse(window.localStorage.getItem(Config.WEB_LOCAL_STORAGE_KEY));
      let d = new Date();
      d.toLocaleString('en-US', { timeZone: 'America/New_York' });
      if(!this.lsItineraryObj) {
        this.lsItineraryObj = {
          lastUpdated: d,
          itineraryList: []
        }
        window.localStorage.setItem(Config.WEB_LOCAL_STORAGE_KEY, JSON.stringify(this.lsItineraryObj));
      }
    } else {
      alert("Local Storage NOT supported by browser. Itinerary will not be saved.");
    }
  }

  editItinerary(itinerary: Itinerary) {

  }
}
