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

  lsItineraryList: Itinerary[];
  descriptions:{
    icon: IconDefinition ;
    description: string;
  }[];
  itineraryName: string;
  headerLabel: string;
  faEye: IconDefinition;
  itineraryNameFrmCtrl: FormControl;
  
  constructor(private itineraryService: ItineraryService, private router: Router) { }

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

  buildItinerary() {
    if(!this.itineraryNameFrmCtrl.invalid) {
      this.itineraryService.itinerary = new Itinerary();
      debugger;
      this.itineraryService.itinerary.itineraryName = this.itineraryNameFrmCtrl.value;
      this.router.navigate(['/itinerary']);
    } else {
      alert(Config.LABELS.ERROR.ITINERARY_NAME_EMPTY);
    }
  }

  editItinerary(itinerary: Itinerary) {
    itinerary.itineraryStatus = Config.IT_STATUS_EDIT;
    this.itineraryService.itinerary = itinerary;
    this.router.navigate(['/itinerary']);
  }

}
