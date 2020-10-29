import { Itinerary } from './itinerary';

/** Web Storage object structure. */
export interface StorageItinerary {
    lastUpdated: Date,
    itineraryList: Itinerary[]
}