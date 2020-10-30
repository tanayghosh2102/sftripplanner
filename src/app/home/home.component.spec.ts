import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {  RouterTestingModule } from '@angular/router/testing'
import {  Router, Routes } from '@angular/router'
import { Location } from '@angular/common';

import { HomeComponent } from './home.component';
import { TripPlannerComponent } from '../trip-planner/trip-planner.component';
import { ItineraryService } from '../itinerary.service';
import { Itinerary } from '../itinerary';
import { Config } from '../configuration';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'itinerary', component: TripPlannerComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
];

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let location: Location;
  let itineraryService: ItineraryService;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes(routes), FormsModule, ReactiveFormsModule, FontAwesomeModule],
      declarations: [ HomeComponent ],
      providers: [ItineraryService]
    })
    .compileComponents().then(() => {
      router = TestBed.inject(Router);
      location = TestBed.inject(Location);
      itineraryService = TestBed.inject(ItineraryService);

      itineraryService.itinerary = new Itinerary();
      itineraryService.lsItineraryObj = {
        lastUpdated: new Date(),
        itineraryList: []
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
    fixture.ngZone.run(() => {
      router.initialNavigation();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should rendered header label.', () => {
    const headerLabel = el.query(By.css("#headerLabel h3")).nativeElement;
    expect(headerLabel.innerHTML).toContain(Config.LABELS.HEADER);

  });

  it('should rendered description cards.', () => {
    const descCards = el.query(By.css(".desc-card"));
    expect(descCards).toBeTruthy();
  });

  it('should enter an itinerary name and click on build itinerary button.', () => {
    const enterItinName = el.query(By.css('#enterItineraryName')).nativeElement;
    enterItinName.value = "Test Itinerary";
    enterItinName.dispatchEvent(new Event("input"));
    const buildItinDebugButton = el.query(By.css('#buildItineraryButton'));
    const buildItinButton = buildItinDebugButton.nativeElement;
    buildItinDebugButton.triggerEventHandler("click", null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      console.log(location.path());
      expect(location.path()).toBe('/itinerary');
    });
  });
});
