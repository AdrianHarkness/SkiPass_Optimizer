
import { Resort } from './types';

export const PASS_PRICES = {
  epic: {
    full: 1047,
    local: 859, // 24/25 approximate final price
  },
  ikon: {
    full: 1449,
    base: 1059,
    basePlus: 1319,
  },
  mountainCollective: 650, 
  indy: {
    base: 419,
    plus: 539
  }
};

// Representative 2024/25 Pricing for "All Resorts" tier (safest bet)
export const EPIC_DAY_PASS_PRICES = {
  1: 136,
  2: 254,
  3: 366,
  4: 471,
  5: 574,
  6: 671,
  7: 761
};

export const IKON_SESSION_PRICES = {
  2: 329,
  3: 449,
  4: 539
};

export const US_RESORTS: Resort[] = [
  // --- COLORADO ---
  { 
    id: 'vail', 
    name: 'Vail', 
    region: 'Colorado', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 299,
    advanceTicketPrice: 265,
    locationKeywords: ['Denver', 'Colorado', 'Eagle County'],
    websiteUrl: 'https://www.vail.com'
  },
  { 
    id: 'breckenridge', 
    name: 'Breckenridge', 
    region: 'Colorado', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 279,
    advanceTicketPrice: 249,
    locationKeywords: ['Denver', 'Summit County', 'Colorado'],
    websiteUrl: 'https://www.breckenridge.com'
  },
  { 
    id: 'keystone', 
    name: 'Keystone', 
    region: 'Colorado', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 269,
    advanceTicketPrice: 235,
    locationKeywords: ['Denver', 'Summit County', 'Colorado'],
    websiteUrl: 'https://www.keystoneresort.com'
  },
  { 
    id: 'beaver-creek', 
    name: 'Beaver Creek', 
    region: 'Colorado', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 299,
    advanceTicketPrice: 265,
    locationKeywords: ['Denver', 'Avon', 'Colorado'],
    websiteUrl: 'https://www.beavercreek.com'
  },
  { 
    id: 'aspen-snowmass', 
    name: 'Aspen Snowmass', 
    region: 'Colorado', 
    passAffiliation: ['Ikon', 'Mountain Collective'], 
    dayTicketPrice: 249, 
    advanceTicketPrice: 214,
    seasonPassPrice: 3099,
    locationKeywords: ['Aspen', 'Denver', 'Colorado'],
    websiteUrl: 'https://www.aspensnowmass.com'
  },
  { 
    id: 'steamboat', 
    name: 'Steamboat', 
    region: 'Colorado', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 280,
    advanceTicketPrice: 225,
    locationKeywords: ['Steamboat Springs', 'Denver', 'Colorado'],
    websiteUrl: 'https://www.steamboat.com'
  },
  { 
    id: 'winter-park', 
    name: 'Winter Park', 
    region: 'Colorado', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 259, 
    advanceTicketPrice: 199,
    seasonPassPrice: 699,
    locationKeywords: ['Denver', 'Colorado'],
    websiteUrl: 'https://www.winterparkresort.com'
  },
  { 
    id: 'copper-mountain', 
    name: 'Copper Mountain', 
    region: 'Colorado', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 219, 
    advanceTicketPrice: 169,
    seasonPassPrice: 899,
    locationKeywords: ['Denver', 'Summit County', 'Colorado'],
    websiteUrl: 'https://www.coppercolorado.com'
  },
  { 
    id: 'arapahoe-basin', 
    name: 'Arapahoe Basin', 
    region: 'Colorado', 
    passAffiliation: ['Ikon', 'Mountain Collective'], 
    dayTicketPrice: 149, 
    advanceTicketPrice: 119,
    seasonPassPrice: 619,
    locationKeywords: ['Denver', 'Summit County', 'Colorado'],
    websiteUrl: 'https://www.arapahoebasin.com'
  },
  {
    id: 'telluride',
    name: 'Telluride',
    region: 'Colorado',
    passAffiliation: ['Epic'], // Limited days on Epic
    dayTicketPrice: 245,
    advanceTicketPrice: 215,
    seasonPassPrice: 2600,
    locationKeywords: ['Colorado'],
    websiteUrl: 'https://tellurideskiresort.com'
  },
  {
    id: 'crested-butte',
    name: 'Crested Butte',
    region: 'Colorado',
    passAffiliation: ['Epic'],
    dayTicketPrice: 199,
    advanceTicketPrice: 169,
    locationKeywords: ['Colorado'],
    websiteUrl: 'https://www.skicb.com'
  },

  // --- UTAH ---
  { 
    id: 'park-city', 
    name: 'Park City', 
    region: 'Utah', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 290,
    advanceTicketPrice: 255,
    locationKeywords: ['Salt Lake City', 'SLC', 'Utah'],
    websiteUrl: 'https://www.parkcitymountain.com'
  },
  { 
    id: 'deer-valley', 
    name: 'Deer Valley', 
    region: 'Utah', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 299, 
    advanceTicketPrice: 259,
    seasonPassPrice: 2999,
    locationKeywords: ['Salt Lake City', 'SLC', 'Utah', 'Park City'],
    websiteUrl: 'https://www.deervalley.com'
  },
  { 
    id: 'alta', 
    name: 'Alta', 
    region: 'Utah', 
    passAffiliation: ['Ikon', 'Mountain Collective'], 
    dayTicketPrice: 184, 
    advanceTicketPrice: 154,
    seasonPassPrice: 1399,
    locationKeywords: ['Salt Lake City', 'SLC', 'Utah'],
    websiteUrl: 'https://www.alta.com'
  },
  { 
    id: 'snowbird', 
    name: 'Snowbird', 
    region: 'Utah', 
    passAffiliation: ['Ikon', 'Mountain Collective'], 
    dayTicketPrice: 195, 
    advanceTicketPrice: 165,
    seasonPassPrice: 1499,
    locationKeywords: ['Salt Lake City', 'SLC', 'Utah'],
    websiteUrl: 'https://www.snowbird.com'
  },
  { 
    id: 'solitude', 
    name: 'Solitude', 
    region: 'Utah', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 179, 
    advanceTicketPrice: 139,
    seasonPassPrice: 1049,
    locationKeywords: ['Salt Lake City', 'SLC', 'Utah'],
    websiteUrl: 'https://www.solitudemountain.com'
  },
  { 
    id: 'brighton', 
    name: 'Brighton', 
    region: 'Utah', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 160, 
    advanceTicketPrice: 125,
    seasonPassPrice: 1099,
    locationKeywords: ['Salt Lake City', 'SLC', 'Utah'],
    websiteUrl: 'https://brightonresort.com'
  },
  {
    id: 'snowbasin',
    name: 'Snowbasin',
    region: 'Utah',
    passAffiliation: ['Ikon', 'Mountain Collective'],
    dayTicketPrice: 185,
    advanceTicketPrice: 155,
    seasonPassPrice: 1299,
    locationKeywords: ['Ogden', 'Salt Lake City', 'SLC', 'Utah'],
    websiteUrl: 'https://www.snowbasin.com'
  },

  // --- WYOMING / MONTANA / IDAHO ---
  { 
    id: 'jackson-hole', 
    name: 'Jackson Hole', 
    region: 'Wyoming', 
    passAffiliation: ['Ikon', 'Mountain Collective'], 
    dayTicketPrice: 255, 
    advanceTicketPrice: 215,
    seasonPassPrice: 1829,
    locationKeywords: ['Jackson', 'Wyoming'],
    websiteUrl: 'https://www.jacksonhole.com'
  },
  { 
    id: 'big-sky', 
    name: 'Big Sky', 
    region: 'Montana', 
    passAffiliation: ['Ikon', 'Mountain Collective'], 
    dayTicketPrice: 240, 
    advanceTicketPrice: 190,
    seasonPassPrice: 1850,
    locationKeywords: ['Bozeman', 'Montana'],
    websiteUrl: 'https://bigskyresort.com'
  },
  { 
    id: 'whitefish', 
    name: 'Whitefish Mountain Resort', 
    region: 'Montana', 
    passAffiliation: [], 
    dayTicketPrice: 104, 
    advanceTicketPrice: 94,
    seasonPassPrice: 749,
    locationKeywords: ['Kalispell', 'Glacier', 'Montana'],
    websiteUrl: 'https://skiwhitefish.com',
    multiDayPrices: {
      2: 195,
      3: 275,
      4: 345,
      5: 410,
      6: 475
    }
  },
  {
    id: 'sun-valley',
    name: 'Sun Valley',
    region: 'Idaho',
    passAffiliation: ['Ikon', 'Mountain Collective'],
    dayTicketPrice: 239,
    advanceTicketPrice: 199,
    seasonPassPrice: 2399,
    locationKeywords: ['Idaho', 'Boise'],
    websiteUrl: 'https://www.sunvalley.com'
  },
  {
    id: 'schweitzer',
    name: 'Schweitzer',
    region: 'Idaho',
    passAffiliation: ['Ikon'],
    dayTicketPrice: 145,
    advanceTicketPrice: 115,
    seasonPassPrice: 1199,
    locationKeywords: ['Idaho', 'Spokane'],
    websiteUrl: 'https://www.schweitzer.com'
  },

  // --- CALIFORNIA / TAHOE ---
  { 
    id: 'mammoth', 
    name: 'Mammoth Mountain', 
    region: 'California', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 269,
    advanceTicketPrice: 219,
    locationKeywords: ['Los Angeles', 'LA', 'Mammoth Lakes', 'California'],
    websiteUrl: 'https://www.mammothmountain.com'
  },
  { 
    id: 'palisades-tahoe', 
    name: 'Palisades Tahoe', 
    region: 'California', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 279,
    advanceTicketPrice: 229,
    locationKeywords: ['Lake Tahoe', 'Reno', 'San Francisco', 'Bay Area', 'California'],
    websiteUrl: 'https://www.palisadestahoe.com'
  },
  { 
    id: 'heavenly', 
    name: 'Heavenly', 
    region: 'California', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 259,
    advanceTicketPrice: 219,
    locationKeywords: ['Lake Tahoe', 'Reno', 'South Lake Tahoe', 'California'],
    websiteUrl: 'https://www.skiheavenly.com'
  },
  { 
    id: 'northstar', 
    name: 'Northstar', 
    region: 'California', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 269,
    advanceTicketPrice: 229,
    locationKeywords: ['Lake Tahoe', 'Truckee', 'Reno', 'California'],
    websiteUrl: 'https://www.northstarcalifornia.com'
  },
  { 
    id: 'kirkwood', 
    name: 'Kirkwood', 
    region: 'California', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 199,
    advanceTicketPrice: 159,
    locationKeywords: ['Lake Tahoe', 'San Francisco', 'Bay Area', 'California'],
    websiteUrl: 'https://www.kirkwood.com'
  },
  { 
    id: 'china-peak', 
    name: 'China Peak', 
    region: 'California', 
    passAffiliation: ['Indy'], 
    dayTicketPrice: 129, 
    advanceTicketPrice: 109,
    seasonPassPrice: 599,
    locationKeywords: ['Fresno', 'California'],
    websiteUrl: 'https://www.skichinapeak.com',
    multiDayPrices: {
      2: 219,
      3: 299
    }
  },
  {
    id: 'big-bear',
    name: 'Big Bear Mountain Resort',
    region: 'California',
    passAffiliation: ['Ikon'],
    dayTicketPrice: 179,
    advanceTicketPrice: 139,
    seasonPassPrice: 799,
    locationKeywords: ['Los Angeles', 'LA', 'SoCal', 'California'],
    websiteUrl: 'https://www.bigbearmountainresort.com'
  },

  // --- PACIFIC NORTHWEST ---
  { 
    id: 'whistler-blackcomb', 
    name: 'Whistler Blackcomb', 
    region: 'Canada (BC)', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 230,
    advanceTicketPrice: 195,
    locationKeywords: ['Vancouver', 'BC', 'Canada'],
    websiteUrl: 'https://www.whistlerblackcomb.com'
  },
  {
    id: 'crystal-mountain',
    name: 'Crystal Mountain',
    region: 'Washington',
    passAffiliation: ['Ikon'],
    dayTicketPrice: 189,
    advanceTicketPrice: 149,
    seasonPassPrice: 1299,
    locationKeywords: ['Seattle', 'Washington', 'PNW'],
    websiteUrl: 'https://www.crystalmountainresort.com'
  },
  {
    id: 'stevens-pass',
    name: 'Stevens Pass',
    region: 'Washington',
    passAffiliation: ['Epic'],
    dayTicketPrice: 169,
    advanceTicketPrice: 129,
    locationKeywords: ['Seattle', 'Washington', 'PNW'],
    websiteUrl: 'https://www.stevenspass.com'
  },
  {
    id: 'summit-at-snoqualmie',
    name: 'The Summit at Snoqualmie',
    region: 'Washington',
    passAffiliation: ['Ikon'],
    dayTicketPrice: 125,
    advanceTicketPrice: 99,
    seasonPassPrice: 799,
    locationKeywords: ['Seattle', 'Washington', 'PNW'],
    websiteUrl: 'https://summitatsnoqualmie.com'
  },
  {
    id: 'mt-bachelor',
    name: 'Mt. Bachelor',
    region: 'Oregon',
    passAffiliation: ['Ikon'],
    dayTicketPrice: 179,
    advanceTicketPrice: 139,
    seasonPassPrice: 1199,
    locationKeywords: ['Bend', 'Oregon', 'PNW'],
    websiteUrl: 'https://www.mtbachelor.com'
  },

  // --- NORTHEAST ---
  { 
    id: 'stowe', 
    name: 'Stowe', 
    region: 'Vermont', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 219,
    advanceTicketPrice: 189,
    locationKeywords: ['Burlington', 'Vermont', 'Boston', 'New York'],
    websiteUrl: 'https://www.stowe.com'
  },
  { 
    id: 'killington', 
    name: 'Killington', 
    region: 'Vermont', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 189, 
    advanceTicketPrice: 159,
    seasonPassPrice: 1249,
    locationKeywords: ['Rutland', 'Vermont', 'Boston', 'New York', 'NYC'],
    websiteUrl: 'https://www.killington.com'
  },
  { 
    id: 'sugarbush', 
    name: 'Sugarbush', 
    region: 'Vermont', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 179, 
    advanceTicketPrice: 149,
    seasonPassPrice: 1089,
    locationKeywords: ['Burlington', 'Vermont', 'Boston', 'New York'],
    websiteUrl: 'https://www.sugarbush.com'
  },
  { 
    id: 'stratton', 
    name: 'Stratton', 
    region: 'Vermont', 
    passAffiliation: ['Ikon'], 
    dayTicketPrice: 195,
    advanceTicketPrice: 155,
    locationKeywords: ['Manchester', 'Vermont', 'New York', 'NYC'],
    websiteUrl: 'https://www.stratton.com'
  },
  { 
    id: 'okemo', 
    name: 'Okemo', 
    region: 'Vermont', 
    passAffiliation: ['Epic'], 
    dayTicketPrice: 189,
    advanceTicketPrice: 159,
    locationKeywords: ['Vermont', 'New York', 'Boston'],
    websiteUrl: 'https://www.okemo.com'
  },
  {
    id: 'jay-peak',
    name: 'Jay Peak',
    region: 'Vermont',
    passAffiliation: ['Indy'],
    dayTicketPrice: 109,
    advanceTicketPrice: 89,
    seasonPassPrice: 999,
    locationKeywords: ['Vermont', 'Canada', 'East'],
    websiteUrl: 'https://jaypeakresort.com'
  },
  {
    id: 'mount-snow',
    name: 'Mount Snow',
    region: 'Vermont',
    passAffiliation: ['Epic'],
    dayTicketPrice: 169,
    advanceTicketPrice: 139,
    locationKeywords: ['Vermont', 'NYC', 'Boston'],
    websiteUrl: 'https://www.mountsnow.com'
  },
  {
    id: 'smugglers-notch',
    name: 'Smugglers\' Notch',
    region: 'Vermont',
    passAffiliation: [],
    dayTicketPrice: 99,
    advanceTicketPrice: 85,
    seasonPassPrice: 799,
    locationKeywords: ['Vermont', 'Family'],
    websiteUrl: 'https://www.smuggs.com'
  },
  { 
    id: 'sunday-river', 
    name: 'Sunday River', 
    region: 'Maine',
    passAffiliation: ['Ikon'],
    dayTicketPrice: 159,
    advanceTicketPrice: 129,
    seasonPassPrice: 1249,
    locationKeywords: ['Portland', 'Maine', 'Boston'],
    websiteUrl: 'https://www.sundayriver.com'
  },
  { 
    id: 'sugarloaf', 
    name: 'Sugarloaf', 
    region: 'Maine',
    passAffiliation: ['Ikon', 'Mountain Collective'],
    dayTicketPrice: 149,
    advanceTicketPrice: 119,
    seasonPassPrice: 1249,
    locationKeywords: ['Maine', 'Boston'],
    websiteUrl: 'https://www.sugarloaf.com'
  },
  {
    id: 'loon-mountain',
    name: 'Loon Mountain',
    region: 'New Hampshire',
    passAffiliation: ['Ikon'],
    dayTicketPrice: 144,
    advanceTicketPrice: 114,
    seasonPassPrice: 1089,
    locationKeywords: ['Boston', 'New Hampshire', 'Lincoln'],
    websiteUrl: 'https://www.loonmtn.com'
  },
  {
    id: 'hunter-mountain',
    name: 'Hunter Mountain',
    region: 'New York',
    passAffiliation: ['Epic'],
    dayTicketPrice: 119,
    advanceTicketPrice: 99,
    locationKeywords: ['New York', 'NYC', 'Catskills'],
    websiteUrl: 'https://www.huntermtn.com'
  },
  {
    id: 'windham',
    name: 'Windham Mountain Club',
    region: 'New York',
    passAffiliation: ['Ikon'],
    dayTicketPrice: 175,
    advanceTicketPrice: 135,
    seasonPassPrice: 1800,
    locationKeywords: ['New York', 'NYC', 'Catskills'],
    websiteUrl: 'https://www.windhammountainclub.com'
  },
  {
    id: 'blue-mountain-pa',
    name: 'Blue Mountain Resort (PA)',
    region: 'Pennsylvania',
    passAffiliation: [], 
    dayTicketPrice: 69, 
    advanceTicketPrice: 59, 
    seasonPassPrice: 629,
    locationKeywords: ['Philadelphia', 'NYC', 'Pennsylvania', 'Poconos'],
    websiteUrl: 'https://www.skibluemt.com',
    multiDayPrices: {
      2: 109,
      3: 159
    }
  },

  // --- NEW MEXICO ---
  {
    id: 'taos',
    name: 'Taos Ski Valley',
    region: 'New Mexico',
    passAffiliation: ['Ikon', 'Mountain Collective'],
    dayTicketPrice: 195,
    advanceTicketPrice: 165,
    seasonPassPrice: 1200,
    locationKeywords: ['Santa Fe', 'New Mexico'],
    websiteUrl: 'https://www.skitaos.com'
  }
];
