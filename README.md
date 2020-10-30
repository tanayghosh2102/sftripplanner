# Itinerary Planner for Film Locations in SF

An app that shows where movies have been filmed on a map in San Francisco. A trip planner that collects movie locations for the trip.

## Installation

The application needs [Node](https://nodejs.org/en/download/) and [Angular ClI](https://cli.angular.io/) to be installed in the system. *(Please refer the links attached for installation guidelines.)*

 1. Clone the repository.
 2. Install dependencies.
	```bash
	npm install
	```
 3. Start the application.
	```bash
	ng serve
	```
 4. Open the browser and navigate to `http://localhost:4200/`. The application should launch. 
 5. *The application needs Google Maps API key to run.* The process to generate an [API key](https://developers.google.com/maps/documentation/javascript/get-api-key) can be found in the link attched.
 6. Once you have the key, navigate to and open the `index.html` file under the directory `trip-planner/src/`. Search for the text `<ADD_KEY_HERE>` and replace it with the API key.
		  
## Libraries used

 1. Angular 9.1.7
 2. Google Map API 3.40.1
	1. Geocoding API
	2. Maps JavaScript API
	3. Directions API
 3. Angular Router 9.1.9
 4. Bootstrap 6.2.0
 5. Angular Material 9.2.4
 6. Karma 5.0.0 (Unit Testing)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
