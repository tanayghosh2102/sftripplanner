import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEye, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Itinerary } from '../itinerary';
import { ItineraryService } from '../itinerary.service';
import { Config } from '../configuration';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Instance variables
  lsItineraryList: Itinerary[]; // All the itineraries from the storage.
  descriptions:{ // Array of descriptions recieved from the Config file used for labels on UI.
    icon: IconDefinition ;
    description: string;
  }[];
  itineraryName: string; // Binded to the itinerary name input field.
  headerLabel: string; // UI Label received from Config.
  faEye: IconDefinition; // Icon definition for UI received from Config.
  itineraryNameFrmCtrl: FormControl; // Form control for the itinerary name field.
  
  constructor(private itineraryService: ItineraryService, private router: Router) { }

  /** Initializes all the instance variables and sets up all the data that is required for the Component. */
  ngOnInit(): void {
    this.lsItineraryList = [];
    this.descriptions = Config.DESC;
    this.headerLabel = '';
    this.faEye = faEye;
    this.headerLabel = Config.LABELS.HEADER;
    this.itineraryService.itinerary = new Itinerary();
    this.lsItineraryList = this.itineraryService.lsItineraryObj.itineraryList;
    this.itineraryNameFrmCtrl = new FormControl();
    this.itineraryNameFrmCtrl.validator = Validators.required;
  }

  /** Creates a new instance of Itinerary and navigates to TripPlanner page */
  buildItinerary() {
    if(this.checkForDupicateName()) {
      alert(Config.LABELS.ERROR.DUPLICATE_NAME);
    } else if(!this.itineraryNameFrmCtrl.invalid) {
      this.itineraryService.itinerary = new Itinerary();
      this.itineraryService.itinerary.itineraryName = this.itineraryNameFrmCtrl.value;
      this.router.navigate(['/itinerary']);
    } else {
      alert(Config.LABELS.ERROR.ITINERARY_NAME_EMPTY);
    }
  }

  /** This funstion checks for an itinerary which has the same name as the entered input because the name of the itinerary should be unique as it acts as the primary key. */
  checkForDupicateName() {
    let length = this.itineraryService.lsItineraryObj.itineraryList;
    for(let itin of this.itineraryService.lsItineraryObj.itineraryList) {
      if(itin.itineraryName === this.itineraryNameFrmCtrl.value) {
        return true;
      }
    }
    return false;
  }

  /** Navigates to trip planner page and edits an existing instance of Itinerary from the storage. */
  editItinerary(itinerary: Itinerary) {
    itinerary.itineraryStatus = Config.IT_STATUS_EDIT;
    this.itineraryService.itinerary = itinerary;
    this.router.navigate(['/itinerary']);
  }

}
