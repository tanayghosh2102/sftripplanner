import { Config } from './configuration';
import { Waypoint } from './waypoint';

export class Itinerary {
    itineraryName: string = "";
    itineraryInfo: Waypoint[] = [];
    itineraryStatus: string = Config.IT_STATUS_UNSAVED;
    dateCreated: Date;
    lastEdited: Date;

    constructor() {
        let d = new Date();
        d.toLocaleString('en-US', { timeZone: 'America/New_York' });
        this.dateCreated = d;
        this.lastEdited = d;
    }
}