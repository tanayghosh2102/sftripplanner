import { Config } from './configuration';
import { Waypoint } from './waypoint';

/** Itinerary class used to store and manage itinerary. */
export class Itinerary {
    itineraryName: string = "";
    itineraryInfo: Waypoint[] = [];
    itineraryStatus: string = Config.IT_STATUS_UNSAVED; // 'unsaved' | 'saved' | 'edit' | 'delete'
    dateCreated: Date;
    lastEdited: Date;

    constructor() {
        let d = new Date();
        d.toLocaleString('en-US', { timeZone: 'America/New_York' });
        this.dateCreated = d;
        this.lastEdited = d;
    }
}