/**
 * @module LocationUtils
 * @description A comprehensive collection of utility functions for working with geographic locations and coordinates.
 * Provides methods for calculating distances, bearings, and destinations using the Haversine formula,
 * converting between coordinate formats (DD, DMS), working with the Geolocation API,
 * managing bounding boxes, and handling coordinate transformations.
 * @example
 * ```typescript
 * import { LocationUtils } from 'js-utils';
 *
 * // Calculate distance between two points
 * const distance = LocationUtils.calculateDistance(40.7128, -74.0060, 51.5074, -0.1278);
 * console.log(`Distance: ${distance.toFixed(2)} km`);
 *
 * // Format coordinates in DMS format
 * const formatted = LocationUtils.formatCoordinate(40.7128, -74.0060, 'DMS');
 * console.log(formatted); // "40° 42' 46.08" N, 74° 0' 21.60" W"
 *
 * // Get current position
 * const position = await LocationUtils.getCurrentPosition();
 * console.log(`Current location: ${position.coords.latitude}, ${position.coords.longitude}`);
 * ```
 */

export const LocationUtils = {
  /**
   * Calculates the bearing (direction) between two geographic coordinates using the Haversine formula.
   * @param lat1 - The first latitude in degrees
   * @param lon1 - The first longitude in degrees
   * @param lat2 - The second latitude in degrees
   * @param lon2 - The second longitude in degrees
   * @returns The bearing in degrees (0-360) from north
   * @example
   * ```typescript
   * // Calculate bearing from New York to London
   * const bearing = LocationUtils.calculateBearing(40.7128, -74.0060, 51.5074, -0.1278);
   * console.log(`Bearing: ${bearing.toFixed(1)}°`); // "Bearing: 77.5°"
   *
   * // Calculate bearing between two points in the same city
   * const localBearing = LocationUtils.calculateBearing(40.7128, -74.0060, 40.7589, -73.9851);
   * console.log(`Local bearing: ${localBearing.toFixed(1)}°`); // "Local bearing: 45.2°"
   * ```
   */
  calculateBearing(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const dLon = this.toRad(lon2 - lon1);
    const lat1Rad = this.toRad(lat1);
    const lat2Rad = this.toRad(lat2);

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

    let bearing = this.toDeg(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;
    return bearing;
  },

  /**
   * Calculates a new coordinate point based on a starting point, distance, and bearing using the Haversine formula.
   * @param lat - The starting latitude in degrees
   * @param lon - The starting longitude in degrees
   * @param distance - The distance to travel in kilometers
   * @param bearing - The bearing (direction) in degrees (0-360)
   * @returns An object containing the new latitude and longitude coordinates
   * @example
   * ```typescript
   * // Calculate a point 100km northeast of New York
   * const destination = LocationUtils.calculateDestination(40.7128, -74.0060, 100, 45);
   * console.log(`Destination: ${destination.latitude.toFixed(4)}, ${destination.longitude.toFixed(4)}`);
   * // "Destination: 41.4000, -73.1000"
   *
   * // Calculate a point 50km south of a location
   * const southPoint = LocationUtils.calculateDestination(40.7128, -74.0060, 50, 180);
   * console.log(`South point: ${southPoint.latitude.toFixed(4)}, ${southPoint.longitude.toFixed(4)}`);
   * ```
   */
  calculateDestination(
    lat: number,
    lon: number,
    distance: number,
    bearing: number
  ): { latitude: number; longitude: number } {
    const R = 6371; // Earth's radius in kilometers
    const d = distance / R; // Angular distance
    const lat1 = this.toRad(lat);
    const lon1 = this.toRad(lon);
    const brng = this.toRad(bearing);

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d) +
        Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
    );

    const lon2 =
      lon1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
        Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
      );

    return {
      latitude: this.toDeg(lat2),
      longitude: this.toDeg(lon2),
    };
  },

  /**
   * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
   * @param lat1 - The first latitude in degrees
   * @param lon1 - The first longitude in degrees
   * @param lat2 - The second latitude in degrees
   * @param lon2 - The second longitude in degrees
   * @returns The distance in kilometers
   * @example
   * ```typescript
   * // Calculate distance between New York and London
   * const distance = LocationUtils.calculateDistance(40.7128, -74.0060, 51.5074, -0.1278);
   * console.log(`Distance: ${distance.toFixed(1)} km`); // "Distance: 5570.2 km"
   *
   * // Calculate distance between two points in the same city
   * const localDistance = LocationUtils.calculateDistance(40.7128, -74.0060, 40.7589, -73.9851);
   * console.log(`Local distance: ${localDistance.toFixed(2)} km`); // "Local distance: 8.45 km"
   * ```
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Stops watching the user's position that was previously started with watchPosition.
   * @param watchId - The watch ID returned by watchPosition
   * @throws {Error} If geolocation is not supported by the browser
   * @example
   * ```typescript
   * // Start watching position
   * const watchId = LocationUtils.watchPosition(position => {
   *   console.log('Position updated:', position.coords);
   * });
   *
   * // Later, stop watching
   * LocationUtils.clearWatch(watchId);
   * console.log('Position watching stopped');
   * ```
   */
  clearWatch(watchId: number): void {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }

    navigator.geolocation.clearWatch(watchId);
  },

  /**
   * Formats geographic coordinates as a string in either decimal degrees (DD) or degrees, minutes, seconds (DMS) format.
   * @param lat - The latitude in degrees
   * @param lon - The longitude in degrees
   * @param format - The format to use: 'DD' for decimal degrees or 'DMS' for degrees, minutes, seconds
   * @returns A formatted coordinate string
   * @example
   * ```typescript
   * // Decimal degrees format
   * const dd = LocationUtils.formatCoordinate(40.7128, -74.0060, 'DD');
   * console.log(dd); // "40.712800, -74.006000"
   *
   * // Degrees, minutes, seconds format
   * const dms = LocationUtils.formatCoordinate(40.7128, -74.0060, 'DMS');
   * console.log(dms); // "40° 42' 46.08" N, 74° 0' 21.60" W"
   *
   * // Southern hemisphere example
   * const sydney = LocationUtils.formatCoordinate(-33.8688, 151.2093, 'DMS');
   * console.log(sydney); // "33° 52' 7.68" S, 151° 12' 33.48" E"
   * ```
   */
  formatCoordinate(
    lat: number,
    lon: number,
    format: "DMS" | "DD" = "DD"
  ): string {
    if (format === "DD") {
      return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }

    const latDir = lat >= 0 ? "N" : "S";
    const lonDir = lon >= 0 ? "E" : "W";
    const latAbs = Math.abs(lat);
    const lonAbs = Math.abs(lon);

    const latDeg = Math.floor(latAbs);
    const latMin = Math.floor((latAbs - latDeg) * 60);
    const latSec = ((latAbs - latDeg) * 60 - latMin) * 60;

    const lonDeg = Math.floor(lonAbs);
    const lonMin = Math.floor((lonAbs - lonDeg) * 60);
    const lonSec = ((lonAbs - lonDeg) * 60 - lonMin) * 60;

    return `${latDeg}° ${latMin}' ${latSec.toFixed(
      2
    )}" ${latDir}, ${lonDeg}° ${lonMin}' ${lonSec.toFixed(2)}" ${lonDir}`;
  },

  /**
   * Gets the user's current position using the browser's Geolocation API.
   * @param options - Geolocation options for accuracy, timeout, and maximum age
   * @returns A Promise that resolves with the GeolocationPosition object
   * @throws {Error} If geolocation is not supported by the browser
   * @example
   * ```typescript
   * try {
   *   const position = await LocationUtils.getCurrentPosition({
   *     enableHighAccuracy: true,
   *     timeout: 5000,
   *     maximumAge: 0
   *   });
   *
   *   console.log(`Latitude: ${position.coords.latitude}`);
   *   console.log(`Longitude: ${position.coords.longitude}`);
   *   console.log(`Accuracy: ${position.coords.accuracy} meters`);
   * } catch (error) {
   *   console.error('Error getting position:', error);
   * }
   * ```
   */
  async getCurrentPosition(
    options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  ): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  },

  /**
   * Calculates the center point of a geographic bounding box.
   * @param bounds - The bounding box with north, south, east, and west coordinates
   * @returns An object containing the latitude and longitude of the center point
   * @example
   * ```typescript
   * const bounds = {
   *   north: 41.0,
   *   south: 40.0,
   *   east: -73.0,
   *   west: -74.0
   * };
   *
   * const center = LocationUtils.getBoundsCenter(bounds);
   * console.log(`Center: ${center.latitude.toFixed(4)}, ${center.longitude.toFixed(4)}`);
   * // "Center: 40.5000, -73.5000"
   * ```
   */
  getBoundsCenter(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): { latitude: number; longitude: number } {
    return {
      latitude: (bounds.north + bounds.south) / 2,
      longitude: (bounds.east + bounds.west) / 2,
    };
  },

  /**
   * Calculates a bounding box for a given radius around a center point.
   * @param lat - The center latitude in degrees
   * @param lon - The center longitude in degrees
   * @param radius - The radius in kilometers
   * @returns A bounding box with north, south, east, and west coordinates
   * @example
   * ```typescript
   * // Get bounding box for 10km radius around New York
   * const bounds = LocationUtils.getBoundsForRadius(40.7128, -74.0060, 10);
   * console.log('Bounding box:', bounds);
   * // {
   * //   north: 40.8028,
   * //   south: 40.6228,
   * //   east: -73.9060,
   * //   west: -74.1060
   * // }
   *
   * // Check if a point is within this radius
   * const isInside = LocationUtils.isWithinBounds(40.7589, -73.9851, bounds);
   * console.log(`Point is within 10km: ${isInside}`); // true
   * ```
   */
  getBoundsForRadius(
    lat: number,
    lon: number,
    radius: number
  ): {
    north: number;
    south: number;
    east: number;
    west: number;
  } {
    const R = 6371; // Earth's radius in kilometers
    const latRad = this.toRad(lat);
    const lonRad = this.toRad(lon);
    const d = radius / R; // Angular distance

    const north = this.toDeg(latRad + d);
    const south = this.toDeg(latRad - d);
    const east = this.toDeg(lonRad + d / Math.cos(latRad));
    const west = this.toDeg(lonRad - d / Math.cos(latRad));

    return { north, south, east, west };
  },

  /**
   * Checks if a coordinate point is within a geographic bounding box.
   * @param lat - The latitude to check in degrees
   * @param lon - The longitude to check in degrees
   * @param bounds - The bounding box with north, south, east, and west coordinates
   * @returns True if the coordinate is within the bounds, false otherwise
   * @example
   * ```typescript
   * const bounds = {
   *   north: 41.0,
   *   south: 40.0,
   *   east: -73.0,
   *   west: -75.0
   * };
   *
   * // Check if New York is within bounds
   * const isInside = LocationUtils.isWithinBounds(40.7128, -74.0060, bounds);
   * console.log(`New York is within bounds: ${isInside}`); // true
   *
   * // Check if London is within bounds
   * const isLondonInside = LocationUtils.isWithinBounds(51.5074, -0.1278, bounds);
   * console.log(`London is within bounds: ${isLondonInside}`); // false
   * ```
   */
  isWithinBounds(
    lat: number,
    lon: number,
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  ): boolean {
    return (
      lat <= bounds.north &&
      lat >= bounds.south &&
      lon <= bounds.east &&
      lon >= bounds.west
    );
  },

  /**
   * Parses a coordinate string in decimal degrees format into latitude and longitude values.
   * @param coordinate - The coordinate string in "latitude, longitude" format
   * @returns An object containing the parsed latitude and longitude
   * @throws {Error} If the coordinate string is invalid or cannot be parsed
   * @example
   * ```typescript
   * // Parse a coordinate string
   * const coord = LocationUtils.parseCoordinate("40.7128, -74.0060");
   * console.log(`Latitude: ${coord.latitude}, Longitude: ${coord.longitude}`);
   * // "Latitude: 40.7128, Longitude: -74.0060"
   *
   * try {
   *   // Invalid format
   *   const invalid = LocationUtils.parseCoordinate("invalid");
   * } catch (error) {
   *   console.error('Error:', error.message); // "Invalid coordinate format"
   * }
   * ```
   */
  parseCoordinate(coordinate: string): { latitude: number; longitude: number } {
    const parts = coordinate.split(",").map((part) => part.trim());
    if (parts.length !== 2) {
      throw new Error("Invalid coordinate format");
    }

    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lon)) {
      throw new Error("Invalid coordinate values");
    }

    return { latitude: lat, longitude: lon };
  },

  /**
   * Converts an angle from radians to degrees.
   * @param radians - The angle in radians
   * @returns The angle in degrees
   * @example
   * ```typescript
   * const degrees = LocationUtils.toDeg(Math.PI);
   * console.log(`${degrees}°`); // "180°"
   *
   * const halfCircle = LocationUtils.toDeg(Math.PI / 2);
   * console.log(`${halfCircle}°`); // "90°"
   * ```
   */
  toDeg(radians: number): number {
    return (radians * 180) / Math.PI;
  },

  /**
   * Converts an angle from degrees to radians.
   * @param degrees - The angle in degrees
   * @returns The angle in radians
   * @example
   * ```typescript
   * const radians = LocationUtils.toRad(180);
   * console.log(radians); // 3.141592653589793 (Math.PI)
   *
   * const halfCircle = LocationUtils.toRad(90);
   * console.log(halfCircle); // 1.5707963267948966 (Math.PI / 2)
   * ```
   */
  toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  },

  /**
   * Starts watching the user's position using the browser's Geolocation API.
   * @param callback - The callback function to be called with position updates
   * @param options - Geolocation options for accuracy, timeout, and maximum age
   * @returns A watch ID that can be used to stop watching with clearWatch
   * @throws {Error} If geolocation is not supported by the browser
   * @example
   * ```typescript
   * // Start watching position with high accuracy
   * const watchId = LocationUtils.watchPosition(
   *   position => {
   *     console.log('Position updated:');
   *     console.log(`Latitude: ${position.coords.latitude}`);
   *     console.log(`Longitude: ${position.coords.longitude}`);
   *     console.log(`Accuracy: ${position.coords.accuracy} meters`);
   *   },
   *   {
   *     enableHighAccuracy: true,
   *     timeout: 5000,
   *     maximumAge: 0
   *   }
   * );
   *
   * // Later, stop watching
   * LocationUtils.clearWatch(watchId);
   * ```
   */
  watchPosition(
    callback: (position: GeolocationPosition) => void,
    options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  ): number {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }

    return navigator.geolocation.watchPosition(callback, undefined, options);
  },
};
