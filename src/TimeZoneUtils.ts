/**
 * @module TimeZoneUtils
 * @description Utility functions for working with time zones, including getting time zone details, managing time zone lists, and handling user time zone preferences. Provides comprehensive support for IANA time zones with proper formatting and validation.
 * @example
 * ```typescript
 * import { TimeZoneUtils } from 'houser-js-utils';
 *
 * // Get user's time zone
 * const userTimeZone = TimeZoneUtils.getUsersTimeZone();
 * console.log(`User's time zone: ${userTimeZone.name} (${userTimeZone.shortName})`);
 *
 * // Get filtered time zones
 * const timeZones = TimeZoneUtils.getTimeZones(['America/New_York', 'Europe/London']);
 *
 * // Get time zone options for select element
 * const options = TimeZoneUtils.getTimeZonesOptions('America/New_York', 'Europe/London');
 * ```
 */

/**
 * Interface for time zone data
 * @interface TimeZone
 * @property {string} name - The IANA time zone name (e.g., 'America/New_York')
 * @property {string} shortName - The abbreviated time zone name (e.g., 'EDT')
 */
interface TimeZone {
  name: string;
  shortName: string;
}

/**
 * Creates an HTML option element string for a time zone
 */
export const createTimeZoneOption = (name: string, shortName: string): string =>
  `<option value="${name}">(${shortName}) ${name}</option>`;

/**
 * List of all available time zones
 */
const timeZones: TimeZone[] = [
  { name: "Pacific/Pago_Pago", shortName: "GMT-11" },
  { name: "Pacific/Niue", shortName: "GMT-11" },
  { name: "Pacific/Rarotonga", shortName: "GMT-10" },
  { name: "Pacific/Tahiti", shortName: "GMT-10" },
  { name: "Pacific/Honolulu", shortName: "HST" },
  { name: "Pacific/Marquesas", shortName: "GMT-9:30" },
  { name: "Pacific/Gambier", shortName: "GMT-9" },
  { name: "America/Adak", shortName: "HADT" },
  { name: "Pacific/Pitcairn", shortName: "GMT-8" },
  { name: "America/Anchorage", shortName: "AKDT" },
  { name: "America/Juneau", shortName: "AKDT" },
  { name: "America/Sitka", shortName: "AKDT" },
  { name: "America/Metlakatla", shortName: "AKDT" },
  { name: "America/Yakutat", shortName: "AKDT" },
  { name: "America/Nome", shortName: "AKDT" },
  { name: "America/Creston", shortName: "MST" },
  { name: "America/Dawson_Creek", shortName: "MST" },
  { name: "America/Fort_Nelson", shortName: "MST" },
  { name: "America/Vancouver", shortName: "PDT" },
  { name: "America/Whitehorse", shortName: "MST" },
  { name: "America/Dawson", shortName: "MST" },
  { name: "America/Hermosillo", shortName: "GMT-7" },
  { name: "America/Tijuana", shortName: "PDT" },
  { name: "America/Phoenix", shortName: "MST" },
  { name: "America/Los_Angeles", shortName: "PDT" },
  { name: "America/Belize", shortName: "CST" },
  { name: "America/Regina", shortName: "CST" },
  { name: "America/Swift_Current", shortName: "CST" },
  { name: "America/Edmonton", shortName: "MDT" },
  { name: "America/Cambridge_Bay", shortName: "MDT" },
  { name: "America/Yellowknife", shortName: "MDT" },
  { name: "America/Inuvik", shortName: "MDT" },
  { name: "America/Costa_Rica", shortName: "CST" },
  { name: "Pacific/Galapagos", shortName: "GMT-6" },
  { name: "America/Guatemala", shortName: "CST" },
  { name: "America/Tegucigalpa", shortName: "CST" },
  { name: "America/Mazatlan", shortName: "GMT-6" },
  { name: "America/Chihuahua", shortName: "GMT-6" },
  { name: "America/Ojinaga", shortName: "MDT" },
  { name: "America/Managua", shortName: "CST" },
  { name: "America/El_Salvador", shortName: "CST" },
  { name: "America/Denver", shortName: "MDT" },
  { name: "America/Boise", shortName: "MDT" },
  { name: "America/Eirunepe", shortName: "GMT-5" },
  { name: "America/Rio_Branco", shortName: "GMT-5" },
  { name: "America/Atikokan", shortName: "EST" },
  { name: "America/Winnipeg", shortName: "CDT" },
  { name: "America/Rainy_River", shortName: "CDT" },
  { name: "America/Resolute", shortName: "CDT" },
  { name: "America/Rankin_Inlet", shortName: "CDT" },
  { name: "Pacific/Easter", shortName: "GMT-5" },
  { name: "America/Bogota", shortName: "GMT-5" },
  { name: "America/Guayaquil", shortName: "GMT-5" },
  { name: "America/Jamaica", shortName: "EST" },
  { name: "America/Mexico_City", shortName: "CDT" },
  { name: "America/Cancun", shortName: "EST" },
  { name: "America/Merida", shortName: "CDT" },
  { name: "America/Monterrey", shortName: "CDT" },
  { name: "America/Matamoros", shortName: "CDT" },
  { name: "America/Bahia_Banderas", shortName: "CDT" },
  { name: "America/Panama", shortName: "EST" },
  { name: "America/Lima", shortName: "GMT-5" },
  { name: "America/Chicago", shortName: "CDT" },
  { name: "America/Indiana/Tell_City", shortName: "CDT" },
  { name: "America/Indiana/Knox", shortName: "CDT" },
  { name: "America/Menominee", shortName: "CDT" },
  { name: "America/North_Dakota/Center", shortName: "CDT" },
  { name: "America/North_Dakota/New_Salem", shortName: "CDT" },
  { name: "America/North_Dakota/Beulah", shortName: "CDT" },
  { name: "America/Barbados", shortName: "AST" },
  { name: "America/La_Paz", shortName: "GMT-4" },
  { name: "America/Campo_Grande", shortName: "GMT-4" },
  { name: "America/Cuiaba", shortName: "GMT-4" },
  { name: "America/Porto_Velho", shortName: "GMT-4" },
  { name: "America/Boa_Vista", shortName: "GMT-4" },
  { name: "America/Manaus", shortName: "GMT-4" },
  { name: "America/Nassau", shortName: "EDT" },
  { name: "America/Blanc-Sablon", shortName: "AST" },
  { name: "America/Toronto", shortName: "EDT" },
  { name: "America/Nipigon", shortName: "EDT" },
  { name: "America/Thunder_Bay", shortName: "EDT" },
  { name: "America/Iqaluit", shortName: "EDT" },
  { name: "America/Pangnirtung", shortName: "EDT" },
  { name: "America/Havana", shortName: "GMT-4" },
  { name: "America/Curacao", shortName: "AST" },
  { name: "America/Santo_Domingo", shortName: "AST" },
  { name: "America/Guyana", shortName: "GMT-4" },
  { name: "America/Port-au-Prince", shortName: "EDT" },
  { name: "America/Martinique", shortName: "AST" },
  { name: "America/Puerto_Rico", shortName: "AST" },
  { name: "America/Asuncion", shortName: "GMT-4" },
  { name: "America/Grand_Turk", shortName: "EDT" },
  { name: "America/Port_of_Spain", shortName: "AST" },
  { name: "America/New_York", shortName: "EDT" },
  { name: "America/Detroit", shortName: "EDT" },
  { name: "America/Kentucky/Louisville", shortName: "EDT" },
  { name: "America/Kentucky/Monticello", shortName: "EDT" },
  { name: "America/Indiana/Indianapolis", shortName: "EDT" },
  { name: "America/Indiana/Vincennes", shortName: "EDT" },
  { name: "America/Indiana/Winamac", shortName: "EDT" },
  { name: "America/Indiana/Marengo", shortName: "EDT" },
  { name: "America/Indiana/Petersburg", shortName: "EDT" },
  { name: "America/Indiana/Vevay", shortName: "EDT" },
  { name: "America/Caracas", shortName: "GMT-4" },
  { name: "Antarctica/Palmer", shortName: "GMT-3" },
  { name: "Antarctica/Rothera", shortName: "GMT-3" },
  { name: "America/Argentina/Buenos_Aires", shortName: "GMT-3" },
  { name: "America/Argentina/Cordoba", shortName: "GMT-3" },
  { name: "America/Argentina/Salta", shortName: "GMT-3" },
  { name: "America/Argentina/Jujuy", shortName: "GMT-3" },
  { name: "America/Argentina/Tucuman", shortName: "GMT-3" },
  { name: "America/Argentina/Catamarca", shortName: "GMT-3" },
  { name: "America/Argentina/La_Rioja", shortName: "GMT-3" },
  { name: "America/Argentina/San_Juan", shortName: "GMT-3" },
  { name: "America/Argentina/Mendoza", shortName: "GMT-3" },
  { name: "America/Argentina/San_Luis", shortName: "GMT-3" },
  { name: "America/Argentina/Rio_Gallegos", shortName: "GMT-3" },
  { name: "America/Argentina/Ushuaia", shortName: "GMT-3" },
  { name: "Atlantic/Bermuda", shortName: "ADT" },
  { name: "America/Belem", shortName: "GMT-3" },
  { name: "America/Fortaleza", shortName: "GMT-3" },
  { name: "America/Recife", shortName: "GMT-3" },
  { name: "America/Araguaina", shortName: "GMT-3" },
  { name: "America/Maceio", shortName: "GMT-3" },
  { name: "America/Bahia", shortName: "GMT-3" },
  { name: "America/Sao_Paulo", shortName: "GMT-3" },
  { name: "America/Santarem", shortName: "GMT-3" },
  { name: "America/Halifax", shortName: "ADT" },
  { name: "America/Glace_Bay", shortName: "ADT" },
  { name: "America/Moncton", shortName: "ADT" },
  { name: "America/Goose_Bay", shortName: "ADT" },
  { name: "America/Santiago", shortName: "GMT-3" },
  { name: "America/Punta_Arenas", shortName: "GMT-3" },
  { name: "Atlantic/Stanley", shortName: "GMT-3" },
  { name: "America/Cayenne", shortName: "GMT-3" },
  { name: "America/Thule", shortName: "ADT" },
  { name: "America/Paramaribo", shortName: "GMT-3" },
  { name: "America/Montevideo", shortName: "GMT-3" },
  { name: "America/St_Johns", shortName: "GMT-2:30" },
  { name: "America/Noronha", shortName: "GMT-2" },
  { name: "America/Godthab", shortName: "GMT-2" },
  { name: "Atlantic/South_Georgia", shortName: "GMT-2" },
  { name: "America/Miquelon", shortName: "GMT-2" },
  { name: "Atlantic/Cape_Verde", shortName: "GMT-1" },
  { name: "Africa/Abidjan", shortName: "GMT" },
  { name: "Africa/Accra", shortName: "GMT" },
  { name: "America/Danmarkshavn", shortName: "GMT" },
  { name: "America/Scoresbysund", shortName: "GMT" },
  { name: "Africa/Bissau", shortName: "GMT" },
  { name: "Atlantic/Reykjavik", shortName: "GMT" },
  { name: "Africa/Monrovia", shortName: "GMT" },
  { name: "Atlantic/Azores", shortName: "GMT" },
  { name: "Africa/Sao_Tome", shortName: "GMT" },
  { name: "Africa/Algiers", shortName: "GMT+1" },
  { name: "Africa/El_Aaiun", shortName: "GMT+1" },
  { name: "Atlantic/Canary", shortName: "GMT+1" },
  { name: "Atlantic/Faroe", shortName: "GMT+1" },
  { name: "Europe/London", shortName: "GMT+1" },
  { name: "Europe/Dublin", shortName: "GMT+1" },
  { name: "Africa/Casablanca", shortName: "GMT+1" },
  { name: "Africa/Lagos", shortName: "GMT+1" },
  { name: "Europe/Lisbon", shortName: "GMT+1" },
  { name: "Atlantic/Madeira", shortName: "GMT+1" },
  { name: "Africa/Ndjamena", shortName: "GMT+1" },
  { name: "Africa/Tunis", shortName: "GMT+1" },
  { name: "Europe/Andorra", shortName: "GMT+2" },
  { name: "Europe/Tirane", shortName: "GMT+2" },
  { name: "Antarctica/Troll", shortName: "GMT+2" },
  { name: "Europe/Vienna", shortName: "GMT+2" },
  { name: "Europe/Brussels", shortName: "GMT+2" },
  { name: "Europe/Zurich", shortName: "GMT+2" },
  { name: "Europe/Prague", shortName: "GMT+2" },
  { name: "Europe/Berlin", shortName: "GMT+2" },
  { name: "Europe/Copenhagen", shortName: "GMT+2" },
  { name: "Africa/Cairo", shortName: "GMT+2" },
  { name: "Europe/Madrid", shortName: "GMT+2" },
  { name: "Africa/Ceuta", shortName: "GMT+2" },
  { name: "Europe/Paris", shortName: "GMT+2" },
  { name: "Europe/Gibraltar", shortName: "GMT+2" },
  { name: "Europe/Budapest", shortName: "GMT+2" },
  { name: "Europe/Rome", shortName: "GMT+2" },
  { name: "Europe/Luxembourg", shortName: "GMT+2" },
  { name: "Africa/Tripoli", shortName: "GMT+2" },
  { name: "Europe/Monaco", shortName: "GMT+2" },
  { name: "Europe/Malta", shortName: "GMT+2" },
  { name: "Africa/Maputo", shortName: "GMT+2" },
  { name: "Africa/Windhoek", shortName: "GMT+2" },
  { name: "Europe/Amsterdam", shortName: "GMT+2" },
  { name: "Europe/Oslo", shortName: "GMT+2" },
  { name: "Europe/Warsaw", shortName: "GMT+2" },
  { name: "Europe/Belgrade", shortName: "GMT+2" },
  { name: "Europe/Kaliningrad", shortName: "GMT+2" },
  { name: "Africa/Khartoum", shortName: "GMT+2" },
  { name: "Europe/Stockholm", shortName: "GMT+2" },
  { name: "Africa/Johannesburg", shortName: "GMT+2" },
  { name: "Antarctica/Syowa", shortName: "GMT+3" },
  { name: "Europe/Sofia", shortName: "GMT+3" },
  { name: "Europe/Minsk", shortName: "GMT+3" },
  { name: "Asia/Nicosia", shortName: "GMT+3" },
  { name: "Asia/Famagusta", shortName: "GMT+3" },
  { name: "Europe/Tallinn", shortName: "GMT+3" },
  { name: "Europe/Helsinki", shortName: "GMT+3" },
  { name: "Europe/Athens", shortName: "GMT+3" },
  { name: "Asia/Jerusalem", shortName: "GMT+3" },
  { name: "Asia/Baghdad", shortName: "GMT+3" },
  { name: "Asia/Amman", shortName: "GMT+3" },
  { name: "Africa/Nairobi", shortName: "GMT+3" },
  { name: "Asia/Beirut", shortName: "GMT+3" },
  { name: "Europe/Vilnius", shortName: "GMT+3" },
  { name: "Europe/Riga", shortName: "GMT+3" },
  { name: "Europe/Chisinau", shortName: "GMT+3" },
  { name: "Asia/Gaza", shortName: "GMT+3" },
  { name: "Asia/Hebron", shortName: "GMT+3" },
  { name: "Asia/Qatar", shortName: "GMT+3" },
  { name: "Europe/Bucharest", shortName: "GMT+3" },
  { name: "Europe/Moscow", shortName: "GMT+3" },
  { name: "Europe/Simferopol", shortName: "GMT+3" },
  { name: "Europe/Kirov", shortName: "GMT+3" },
  { name: "Asia/Riyadh", shortName: "GMT+3" },
  { name: "Africa/Juba", shortName: "GMT+3" },
  { name: "Asia/Damascus", shortName: "GMT+3" },
  { name: "Europe/Istanbul", shortName: "GMT+3" },
  { name: "Europe/Kiev", shortName: "GMT+3" },
  { name: "Europe/Uzhgorod", shortName: "GMT+3" },
  { name: "Europe/Zaporozhye", shortName: "GMT+3" },
  { name: "Asia/Dubai", shortName: "GMT+4" },
  { name: "Asia/Yerevan", shortName: "GMT+4" },
  { name: "Asia/Baku", shortName: "GMT+4" },
  { name: "Asia/Tbilisi", shortName: "GMT+4" },
  { name: "Indian/Mauritius", shortName: "GMT+4" },
  { name: "Indian/Reunion", shortName: "GMT+4" },
  { name: "Europe/Astrakhan", shortName: "GMT+4" },
  { name: "Europe/Volgograd", shortName: "GMT+4" },
  { name: "Europe/Saratov", shortName: "GMT+4" },
  { name: "Europe/Ulyanovsk", shortName: "GMT+4" },
  { name: "Europe/Samara", shortName: "GMT+4" },
  { name: "Indian/Mahe", shortName: "GMT+4" },
  { name: "Asia/Kabul", shortName: "GMT+4:30" },
  { name: "Asia/Tehran", shortName: "GMT+4:30" },
  { name: "Antarctica/Mawson", shortName: "GMT+5" },
  { name: "Asia/Qyzylorda", shortName: "GMT+5" },
  { name: "Asia/Aqtobe", shortName: "GMT+5" },
  { name: "Asia/Aqtau", shortName: "GMT+5" },
  { name: "Asia/Atyrau", shortName: "GMT+5" },
  { name: "Asia/Oral", shortName: "GMT+5" },
  { name: "Indian/Maldives", shortName: "GMT+5" },
  { name: "Asia/Karachi", shortName: "GMT+5" },
  { name: "Asia/Yekaterinburg", shortName: "GMT+5" },
  { name: "Indian/Kerguelen", shortName: "GMT+5" },
  { name: "Asia/Dushanbe", shortName: "GMT+5" },
  { name: "Asia/Ashgabat", shortName: "GMT+5" },
  { name: "Asia/Samarkand", shortName: "GMT+5" },
  { name: "Asia/Tashkent", shortName: "GMT+5" },
  { name: "Asia/Kolkata", shortName: "GMT+5:30" },
  { name: "Asia/Colombo", shortName: "GMT+5:30" },
  { name: "Asia/Kathmandu", shortName: "GMT+5:45" },
  { name: "Antarctica/Vostok", shortName: "GMT+6" },
  { name: "Asia/Dhaka", shortName: "GMT+6" },
  { name: "Asia/Thimphu", shortName: "GMT+6" },
  { name: "Asia/Urumqi", shortName: "GMT+6" },
  { name: "Indian/Chagos", shortName: "GMT+6" },
  { name: "Asia/Bishkek", shortName: "GMT+6" },
  { name: "Asia/Almaty", shortName: "GMT+6" },
  { name: "Asia/Qostanay", shortName: "GMT+6" },
  { name: "Asia/Omsk", shortName: "GMT+6" },
  { name: "Indian/Cocos", shortName: "GMT+6:30" },
  { name: "Asia/Yangon", shortName: "GMT+6:30" },
  { name: "Antarctica/Davis", shortName: "GMT+7" },
  { name: "Indian/Christmas", shortName: "GMT+7" },
  { name: "Asia/Jakarta", shortName: "GMT+7" },
  { name: "Asia/Pontianak", shortName: "GMT+7" },
  { name: "Asia/Hovd", shortName: "GMT+7" },
  { name: "Asia/Novosibirsk", shortName: "GMT+7" },
  { name: "Asia/Barnaul", shortName: "GMT+7" },
  { name: "Asia/Tomsk", shortName: "GMT+7" },
  { name: "Asia/Novokuznetsk", shortName: "GMT+7" },
  { name: "Asia/Krasnoyarsk", shortName: "GMT+7" },
  { name: "Asia/Bangkok", shortName: "GMT+7" },
  { name: "Asia/Ho_Chi_Minh", shortName: "GMT+7" },
  { name: "Antarctica/Casey", shortName: "GMT+8" },
  { name: "Australia/Perth", shortName: "GMT+8" },
  { name: "Asia/Brunei", shortName: "GMT+8" },
  { name: "Asia/Shanghai", shortName: "GMT+8" },
  { name: "Asia/Hong_Kong", shortName: "GMT+8" },
  { name: "Asia/Makassar", shortName: "GMT+8" },
  { name: "Asia/Ulaanbaatar", shortName: "GMT+8" },
  { name: "Asia/Choibalsan", shortName: "GMT+8" },
  { name: "Asia/Macau", shortName: "GMT+8" },
  { name: "Asia/Kuala_Lumpur", shortName: "GMT+8" },
  { name: "Asia/Kuching", shortName: "GMT+8" },
  { name: "Asia/Manila", shortName: "GMT+8" },
  { name: "Asia/Irkutsk", shortName: "GMT+8" },
  { name: "Asia/Singapore", shortName: "GMT+8" },
  { name: "Asia/Taipei", shortName: "GMT+8" },
  { name: "Australia/Eucla", shortName: "GMT+8:45" },
  { name: "Asia/Jayapura", shortName: "GMT+9" },
  { name: "Asia/Tokyo", shortName: "GMT+9" },
  { name: "Asia/Pyongyang", shortName: "GMT+9" },
  { name: "Asia/Seoul", shortName: "GMT+9" },
  { name: "Pacific/Palau", shortName: "GMT+9" },
  { name: "Asia/Chita", shortName: "GMT+9" },
  { name: "Asia/Yakutsk", shortName: "GMT+9" },
  { name: "Asia/Khandyga", shortName: "GMT+9" },
  { name: "Asia/Dili", shortName: "GMT+9" },
  { name: "Australia/Broken_Hill", shortName: "GMT+9:30" },
  { name: "Australia/Adelaide", shortName: "GMT+9:30" },
  { name: "Australia/Darwin", shortName: "GMT+9:30" },
  { name: "Antarctica/Macquarie", shortName: "GMT+11" },
  { name: "Pacific/Pohnpei", shortName: "GMT+11" },
  { name: "Pacific/Kosrae", shortName: "GMT+11" },
  { name: "Pacific/Noumea", shortName: "GMT+11" },
  { name: "Pacific/Norfolk", shortName: "GMT+11" },
  { name: "Pacific/Bougainville", shortName: "GMT+11" },
  { name: "Asia/Magadan", shortName: "GMT+11" },
  { name: "Asia/Sakhalin", shortName: "GMT+11" },
  { name: "Asia/Srednekolymsk", shortName: "GMT+11" },
  { name: "Pacific/Guadalcanal", shortName: "GMT+11" },
  { name: "Pacific/Efate", shortName: "GMT+11" },
  { name: "Pacific/Fiji", shortName: "GMT+12" },
  { name: "Pacific/Tarawa", shortName: "GMT+12" },
  { name: "Pacific/Majuro", shortName: "GMT+12" },
  { name: "Pacific/Kwajalein", shortName: "GMT+12" },
  { name: "Pacific/Nauru", shortName: "GMT+12" },
  { name: "Pacific/Auckland", shortName: "GMT+12" },
  { name: "Asia/Kamchatka", shortName: "GMT+12" },
  { name: "Asia/Anadyr", shortName: "GMT+12" },
  { name: "Pacific/Funafuti", shortName: "GMT+12" },
  { name: "Pacific/Wake", shortName: "GMT+12" },
  { name: "Pacific/Wallis", shortName: "GMT+12" },
  { name: "Pacific/Chatham", shortName: "GMT+12:45" },
  { name: "Pacific/Enderbury", shortName: "GMT+13" },
  { name: "Pacific/Fakaofo", shortName: "GMT+13" },
  { name: "Pacific/Tongatapu", shortName: "GMT+13" },
  { name: "Pacific/Apia", shortName: "GMT+13" },
  { name: "Pacific/Kiritimati", shortName: "GMT+14" },
  { name: "Antarctica/DumontDUrville", shortName: "GMT+10" },
  { name: "Australia/Hobart", shortName: "GMT+10" },
  { name: "Australia/Currie", shortName: "GMT+10" },
  { name: "Australia/Melbourne", shortName: "GMT+10" },
  { name: "Australia/Sydney", shortName: "GMT+10" },
  { name: "Australia/Brisbane", shortName: "GMT+10" },
  { name: "Australia/Lindeman", shortName: "GMT+10" },
  { name: "Pacific/Chuuk", shortName: "GMT+10" },
  { name: "Pacific/Guam", shortName: "GMT+10" },
  { name: "Pacific/Port_Moresby", shortName: "GMT+10" },
  { name: "Asia/Vladivostok", shortName: "GMT+10" },
  { name: "Asia/Ust-Nera", shortName: "GMT+10" },
  { name: "Australia/Lord_Howe", shortName: "GMT+10:30" },
];

export const TimeZoneUtils = {
  /**
   * Gets details for a specific time zone
   * @param timeZone - The IANA time zone name
   * @returns Object containing time zone name and short name
   * @throws Error if the time zone is invalid
   * @example
   * ```typescript
   * const details = TimeZoneUtils.getTimeZoneDetails('America/New_York');
   * console.log(details);
   * // Output: { name: 'America/New_York', shortName: 'EDT' }
   * ```
   */
  getTimeZoneDetails(timeZone: string): TimeZone {
    const format = new Intl.DateTimeFormat(undefined, {
      timeZoneName: "short",
      timeZone,
    });

    return {
      name: format.resolvedOptions().timeZone,
      shortName:
        format.formatToParts().find((part) => part.type === "timeZoneName")
          ?.value || "",
    };
  },

  /**
   * Gets a list of time zones, optionally filtered and with user's time zone first
   * @param filters - Optional array of time zone names to filter by
   * @param showUsersFirst - Whether to show user's time zone first in the list
   * @returns Array of time zone objects
   * @example
   * ```typescript
   * // Get all time zones with user's time zone first
   * const allTimeZones = TimeZoneUtils.getTimeZones();
   *
   * // Get filtered time zones without user's time zone first
   * const filteredTimeZones = TimeZoneUtils.getTimeZones(
   *   ['America/New_York', 'Europe/London'],
   *   false
   * );
   * ```
   */
  getTimeZones(filters?: string[], showUsersFirst = true): TimeZone[] {
    const hasFilters = filters && filters.length > 0;

    if (!hasFilters && !showUsersFirst) {
      return timeZones;
    }

    const usersTimeZone = showUsersFirst ? this.getUsersTimeZone() : null;

    const result = !hasFilters
      ? [...timeZones]
      : [...new Set(filters || [])]
          .map((filterZone) =>
            timeZones.findIndex((timeZone) => timeZone.name === filterZone)
          )
          .sort()
          .map((zoneIndex) => {
            if (timeZones[zoneIndex]) {
              return this.getTimeZoneDetails(timeZones[zoneIndex].name);
            }
            return null;
          })
          .filter((row): row is TimeZone => !!row);

    if (usersTimeZone && !hasFilters) {
      const userIndex = result.findIndex(
        (timeZone) => timeZone.name === usersTimeZone.name
      );

      if (userIndex !== -1) {
        result.splice(userIndex, 1);
      }

      result.unshift(usersTimeZone);
    }

    return result;
  },

  /**
   * Gets HTML option elements for time zones
   * @param filters - Optional array of time zone names to filter by
   * @returns Array of HTML option strings
   * @example
   * ```typescript
   * // Get options for specific time zones
   * const options = TimeZoneUtils.getTimeZonesOptions(
   *   'America/New_York',
   *   'Europe/London'
   * );
   *
   * // Use in select element
   * const select = document.createElement('select');
   * select.innerHTML = options.join('');
   * ```
   */
  getTimeZonesOptions(...filters: string[]): string[] {
    return this.getTimeZones(filters).map((timeZone) =>
      createTimeZoneOption(timeZone.name, timeZone.shortName)
    );
  },

  /**
   * Gets the user's time zone
   * @returns Time zone object for user's time zone
   * @example
   * ```typescript
   * const userTimeZone = TimeZoneUtils.getUsersTimeZone();
   * console.log(`User's time zone: ${userTimeZone.name} (${userTimeZone.shortName})`);
   * ```
   */
  getUsersTimeZone(): TimeZone {
    return this.getTimeZoneDetails(this.getUsersTimeZoneName());
  },

  /**
   * Gets the user's time zone name
   * @returns User's IANA time zone name
   * @example
   * ```typescript
   * const timeZoneName = TimeZoneUtils.getUsersTimeZoneName();
   * console.log(`User's time zone name: ${timeZoneName}`);
   * ```
   */
  getUsersTimeZoneName(): string {
    return new Intl.DateTimeFormat().resolvedOptions().timeZone;
  },

  /**
   * Checks if a time zone name is valid
   * @param timeZone - The IANA time zone name to check
   * @returns True if the time zone is valid
   * @example
   * ```typescript
   * const isValid = TimeZoneUtils.isValidTimeZone('America/New_York');
   * console.log(`Is valid time zone: ${isValid}`);
   * ```
   */
  isValidTimeZone(timeZone: string): boolean {
    return !!timeZones.find((item) => item.name === timeZone);
  },
};
