import { faSignature, faFilm, faMapMarker, faMapMarked } from '@fortawesome/free-solid-svg-icons';

export const Config = {
    WEB_LOCAL_STORAGE_KEY: 'FilmLocationItineraryPlanner',
    LOCATION: "San Francisco, CA",
    IT_STATUS_SAVED: "saved",
    IT_STATUS_EDIT: "edit",
    IT_STATUS_UNSAVED: "unsaved",
    EVENTS: {
      FETCH_LOCATION: "fetch_location",
      ADD_WAYPOINT: "add_waypoint",
      REMOVE_WAYPOINT: "remove_waypoint",
      REORDER_WAYPOINT: "reorder_waypint"
    },
    MAP_PROPERTIES: {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    MARKER: {
      URL: 'http://maps.google.com/mapfiles/ms/icons/',
      COLOR: {
        RED: "red-dot.png",
        BLUE: "blue-dot.png",
        GREEN: "green-dot.png"
      }
    },
    LABELS: {
      HEADER: 'Film Locations in San Francisco',
      ITINERARY_SAVED: 'Itinerary Saved.',
      ERROR: {
        ITINERARY_NAME_EMPTY: 'Enter a name for the itinerary.',
        NO_LOCATIONS_FOUND: 'No locations found in San Francisco.',
        NO_STORAGE_SUPPORT: 'No Local Storage Support.'
      }
    },
    DESC: [
      {
        icon: faSignature,
        description: 'Add a name to your itinerary.'
      },
      {
        icon: faFilm,
        description: 'Search for a film for locations.'
      },
      {
        icon: faMapMarker,
        description: 'Add locations to your library.'
      },
      {
        icon: faMapMarked,
        description: 'View itinerary on a map.'
      }
    ]
};