import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEye, faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

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
  descriptions:{ // Array of descriptions recieved from the Config file used for labels on View.
    icon: IconDefinition ;
    description: string;
  }[];
  itineraryName: string; // Binded to the itinerary name input field.
  headerLabel: string; // View Label received from Config.
  faIconDef: IconDefinition; // Icon definition for View received from Config.
  itineraryNameFrmCtrl: FormControl; // Form control for the itinerary name field.
  deleteItineraryFrmCtrl: FormControl; // Form control for the delete itinerary checkbox.
  
  constructor(private itineraryService: ItineraryService, private router: Router) { }

  /** Initializes all the instance variables and sets up all the data that is required for the Component. */
  ngOnInit(): void {
    this.lsItineraryList = [];
    this.descriptions = Config.DESC;
    this.headerLabel = '';
    this.faIconDef = faEye;
    this.headerLabel = Config.LABELS.HEADER;
    this.itineraryService.itinerary = new Itinerary();
    this.lsItineraryList = this.itineraryService.lsItineraryObj.itineraryList;
    this.itineraryNameFrmCtrl = new FormControl();
    this.deleteItineraryFrmCtrl = new FormControl();
    this.itineraryNameFrmCtrl.validator = Validators.required;
    this.deleteItineraryFrmCtrl.valueChanges.subscribe(data => {
      if(data) {
        this.faIconDef = faTrashAlt;
      } else {
        this.faIconDef = faEye;
      }
    });
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

  /** This function checks for an itinerary which has the same name as the entered input because the name of the itinerary should be unique as it acts as the primary key. */
  checkForDupicateName() {
    let length = this.itineraryService.lsItineraryObj.itineraryList;
    for(let itin of this.itineraryService.lsItineraryObj.itineraryList) {
      if(itin.itineraryName === this.itineraryNameFrmCtrl.value) {
        return true;
      }
    }
    return false;
  }

  /** Deletes an itinerary in delete mode or in edit mode, navigates to trip planner page and edits an existing instance of Itinerary from the storage. */
  editOrDeleteItinerary(itinerary: Itinerary) {
    if(this.deleteItineraryFrmCtrl.value) {
      itinerary.itineraryStatus = Config.IT_STATUS_DELETE;
      this.itineraryService.itinerary = itinerary;
      this.itineraryService.deleteItinerary();
    } else {
      itinerary.itineraryStatus = Config.IT_STATUS_EDIT;
      this.itineraryService.itinerary = itinerary;
      this.router.navigate(['/itinerary']);
    }
  }

}
