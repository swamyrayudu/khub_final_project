import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    interface ControlOptions {
      waypoints: L.LatLng[];
      router?: IRouter;
      plan?: Plan;
      geocoder?: IGeocoder;
      fitSelectedRoutes?: boolean | string;
      lineOptions?: LineOptions;
      altLineOptions?: LineOptions;
      routeWhileDragging?: boolean;
      routeDragInterval?: number;
      waypointMode?: string;
      useZoomParameter?: boolean;
      showAlternatives?: boolean;
      defaultErrorHandler?: (e: Error) => void;
      containerClassName?: string;
      minimizedClassName?: string;
      show?: boolean;
      collapsible?: boolean;
      autoRoute?: boolean;
      pointMarkerStyle?: L.CircleMarkerOptions;
      summaryTemplate?: string;
      alternativeClassName?: string;
      addWaypoints?: boolean;
      createMarker?: (
        i: number,
        waypoint: Waypoint,
        n: number
      ) => L.Marker | boolean;
    }

    interface LineOptions {
      styles?: L.PathOptions[];
      extendToWaypoints?: boolean;
      missingRouteTolerance?: number;
      addWaypoints?: boolean;
    }

    interface Waypoint {
      latLng: L.LatLng;
      name?: string;
      options?: WaypointOptions;
    }

    interface WaypointOptions {
      allowUTurn?: boolean;
    }

    interface RoutingEvent {
      waypoints: Waypoint[];
    }

    interface IRouter {
      route(
        waypoints: Waypoint[],
        callback: (err?: Error, routes?: IRoute[]) => void,
        context?: object,
        options?: RoutingOptions
      ): void;
    }

    interface IGeocoder {
      geocode(
        query: string,
        callback: (results: GeocoderResult[]) => void,
        context?: object
      ): void;
      reverse?(
        location: L.LatLng,
        scale: number,
        callback: (results: GeocoderResult[]) => void,
        context?: object
      ): void;
    }

    interface GeocoderResult {
      name: string;
      center: L.LatLng;
      bbox?: L.LatLngBounds;
      properties?: object;
    }

    interface RoutingOptions {
      z?: number;
      allowUTurns?: boolean;
      geometryOnly?: boolean;
      fileFormat?: string;
      simplifyGeometry?: boolean;
    }

    interface IRoute {
      name?: string;
      summary?: RouteSummary;
      coordinates: L.LatLng[];
      waypoints: L.LatLng[];
      instructions?: IInstruction[];
      inputWaypoints: Waypoint[];
      actualWaypoints: Waypoint[];
      waypointIndices: number[];
    }

    interface RouteSummary {
      totalTime: number;
      totalDistance: number;
    }

    interface IInstruction {
      type: string;
      text?: string;
      distance: number;
      time: number;
      road?: string;
      direction?: string;
      index: number;
    }

    class Plan extends L.Class {
      constructor(waypoints: L.LatLng[], options?: PlanOptions);
      isReady(): boolean;
      getWaypoints(): Waypoint[];
      setWaypoints(waypoints: L.LatLng[] | Waypoint[]): this;
      spliceWaypoints(
        index: number,
        waypointsToRemove: number,
        ...newWaypoints: L.LatLng[]
      ): Waypoint[];
    }

    interface PlanOptions {
      geocoder?: IGeocoder;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      dragStyles?: L.PathOptions[];
      maxGeocoderTolerance?: number;
      geocoderPlaceholder?: (i: number, n: number) => string;
      geocodersClassName?: string;
      waypointClassName?: string;
      createGeocoderElement?: (
        wp: Waypoint,
        i: number,
        n: number,
        plan: Plan
      ) => HTMLElement;
      createMarker?: (
        i: number,
        waypoint: Waypoint,
        n: number
      ) => L.Marker | boolean;
      routeWhileDragging?: boolean;
      reverseWaypoints?: boolean;
      addButtonClassName?: string;
      language?: string;
    }

    class Control extends L.Control {
      constructor(options?: ControlOptions);
      getWaypoints(): Waypoint[];
      setWaypoints(waypoints: L.LatLng[] | Waypoint[]): this;
      spliceWaypoints(
        index: number,
        waypointsToRemove: number,
        ...newWaypoints: L.LatLng[]
      ): Waypoint[];
      getPlan(): Plan;
      getRouter(): IRouter;
      route(): void;
      on(event: string, fn: (e: RoutingEvent) => void): this;
      show(): void;
      hide(): void;
    }

    function control(options?: ControlOptions): Control;
    function plan(waypoints: L.LatLng[], options?: PlanOptions): Plan;
  }
}

declare module 'leaflet-routing-machine' {
  // This module adds to the L.Routing namespace
}

declare module 'leaflet-routing-machine/dist/leaflet-routing-machine.css' {
  const content: string;
  export default content;
}
