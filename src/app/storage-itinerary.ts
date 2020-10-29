import { Itinerary } from './itinerary';

export interface StorageItinerary {
    lastUpdated: Date,
    itineraryList: Itinerary[]
}