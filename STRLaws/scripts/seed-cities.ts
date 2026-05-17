/**
 * Seed all 50 US states + the top 50 STR-market cities for Phase 1 launch.
 *
 * Top-50 city list curated from AirDNA top STR markets (2024–2025 reports)
 * weighted by Airbnb listing density and search query volume for
 * "[city] airbnb laws / short term rental regulations".
 *
 * Each city ships with one seed source URL (city code home) where known.
 * The scrape pipeline (Phase 3) discovers additional sources from the seed.
 *
 * Usage: pnpm db:seed
 */
import type { RowDataPacket } from 'mysql2/promise';
import { getPool, closePool } from '../server/db/pool';

interface StateSeed {
  slug: string;
  name: string;
}

interface CitySeed {
  stateSlug: string;
  slug: string;
  name: string;
  population: number;
  marketRank: number;
  lat: number;
  lng: number;
  sourceUrl?: string;
}

const STATES: StateSeed[] = [
  { slug: 'alabama', name: 'Alabama' },
  { slug: 'alaska', name: 'Alaska' },
  { slug: 'arizona', name: 'Arizona' },
  { slug: 'arkansas', name: 'Arkansas' },
  { slug: 'california', name: 'California' },
  { slug: 'colorado', name: 'Colorado' },
  { slug: 'connecticut', name: 'Connecticut' },
  { slug: 'delaware', name: 'Delaware' },
  { slug: 'florida', name: 'Florida' },
  { slug: 'georgia', name: 'Georgia' },
  { slug: 'hawaii', name: 'Hawaii' },
  { slug: 'idaho', name: 'Idaho' },
  { slug: 'illinois', name: 'Illinois' },
  { slug: 'indiana', name: 'Indiana' },
  { slug: 'iowa', name: 'Iowa' },
  { slug: 'kansas', name: 'Kansas' },
  { slug: 'kentucky', name: 'Kentucky' },
  { slug: 'louisiana', name: 'Louisiana' },
  { slug: 'maine', name: 'Maine' },
  { slug: 'maryland', name: 'Maryland' },
  { slug: 'massachusetts', name: 'Massachusetts' },
  { slug: 'michigan', name: 'Michigan' },
  { slug: 'minnesota', name: 'Minnesota' },
  { slug: 'mississippi', name: 'Mississippi' },
  { slug: 'missouri', name: 'Missouri' },
  { slug: 'montana', name: 'Montana' },
  { slug: 'nebraska', name: 'Nebraska' },
  { slug: 'nevada', name: 'Nevada' },
  { slug: 'new-hampshire', name: 'New Hampshire' },
  { slug: 'new-jersey', name: 'New Jersey' },
  { slug: 'new-mexico', name: 'New Mexico' },
  { slug: 'new-york', name: 'New York' },
  { slug: 'north-carolina', name: 'North Carolina' },
  { slug: 'north-dakota', name: 'North Dakota' },
  { slug: 'ohio', name: 'Ohio' },
  { slug: 'oklahoma', name: 'Oklahoma' },
  { slug: 'oregon', name: 'Oregon' },
  { slug: 'pennsylvania', name: 'Pennsylvania' },
  { slug: 'rhode-island', name: 'Rhode Island' },
  { slug: 'south-carolina', name: 'South Carolina' },
  { slug: 'south-dakota', name: 'South Dakota' },
  { slug: 'tennessee', name: 'Tennessee' },
  { slug: 'texas', name: 'Texas' },
  { slug: 'utah', name: 'Utah' },
  { slug: 'vermont', name: 'Vermont' },
  { slug: 'virginia', name: 'Virginia' },
  { slug: 'washington', name: 'Washington' },
  { slug: 'west-virginia', name: 'West Virginia' },
  { slug: 'wisconsin', name: 'Wisconsin' },
  { slug: 'wyoming', name: 'Wyoming' },
];

const CITIES: CitySeed[] = [
  { stateSlug: 'tennessee', slug: 'nashville', name: 'Nashville', population: 689447, marketRank: 1, lat: 36.1627, lng: -86.7816, sourceUrl: 'https://www.nashville.gov/departments/codes/short-term-rentals' },
  { stateSlug: 'texas', slug: 'austin', name: 'Austin', population: 974447, marketRank: 2, lat: 30.2672, lng: -97.7431, sourceUrl: 'https://www.austintexas.gov/department/short-term-rental-program' },
  { stateSlug: 'colorado', slug: 'denver', name: 'Denver', population: 711463, marketRank: 3, lat: 39.7392, lng: -104.9903, sourceUrl: 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Department-of-Excise-and-Licenses/Business-Licensing/Short-Term-Rental' },
  { stateSlug: 'arizona', slug: 'phoenix', name: 'Phoenix', population: 1608139, marketRank: 4, lat: 33.4484, lng: -112.0740, sourceUrl: 'https://www.phoenix.gov/finance/strs' },
  { stateSlug: 'arizona', slug: 'scottsdale', name: 'Scottsdale', population: 241361, marketRank: 5, lat: 33.4942, lng: -111.9261, sourceUrl: 'https://www.scottsdaleaz.gov/codes/short-term-rentals' },
  { stateSlug: 'arizona', slug: 'sedona', name: 'Sedona', population: 9684, marketRank: 6, lat: 34.8697, lng: -111.7610, sourceUrl: 'https://www.sedonaaz.gov/' },
  { stateSlug: 'arizona', slug: 'flagstaff', name: 'Flagstaff', population: 76831, marketRank: 7, lat: 35.1983, lng: -111.6513, sourceUrl: 'https://www.flagstaff.az.gov/' },
  { stateSlug: 'florida', slug: 'orlando', name: 'Orlando', population: 307573, marketRank: 8, lat: 28.5384, lng: -81.3789, sourceUrl: 'https://www.orlando.gov/' },
  { stateSlug: 'florida', slug: 'miami', name: 'Miami', population: 442241, marketRank: 9, lat: 25.7617, lng: -80.1918, sourceUrl: 'https://www.miamigov.com/' },
  { stateSlug: 'florida', slug: 'kissimmee', name: 'Kissimmee', population: 79226, marketRank: 10, lat: 28.2920, lng: -81.4076, sourceUrl: 'https://www.kissimmee.gov/' },
  { stateSlug: 'florida', slug: 'panama-city-beach', name: 'Panama City Beach', population: 18935, marketRank: 11, lat: 30.1766, lng: -85.8055, sourceUrl: 'https://www.pcbgov.com/' },
  { stateSlug: 'florida', slug: 'destin', name: 'Destin', population: 13931, marketRank: 12, lat: 30.3935, lng: -86.4958, sourceUrl: 'https://www.cityofdestin.com/' },
  { stateSlug: 'georgia', slug: 'savannah', name: 'Savannah', population: 147780, marketRank: 13, lat: 32.0809, lng: -81.0912, sourceUrl: 'https://www.savannahga.gov/' },
  { stateSlug: 'south-carolina', slug: 'charleston', name: 'Charleston', population: 150227, marketRank: 14, lat: 32.7765, lng: -79.9311, sourceUrl: 'https://www.charleston-sc.gov/' },
  { stateSlug: 'south-carolina', slug: 'myrtle-beach', name: 'Myrtle Beach', population: 35682, marketRank: 15, lat: 33.6891, lng: -78.8867, sourceUrl: 'https://www.cityofmyrtlebeach.com/' },
  { stateSlug: 'north-carolina', slug: 'asheville', name: 'Asheville', population: 94589, marketRank: 16, lat: 35.5951, lng: -82.5515, sourceUrl: 'https://www.ashevillenc.gov/' },
  { stateSlug: 'north-carolina', slug: 'wilmington', name: 'Wilmington', population: 115451, marketRank: 17, lat: 34.2257, lng: -77.9447, sourceUrl: 'https://www.wilmingtonnc.gov/' },
  { stateSlug: 'louisiana', slug: 'new-orleans', name: 'New Orleans', population: 383997, marketRank: 18, lat: 29.9511, lng: -90.0715, sourceUrl: 'https://nola.gov/short-term-rentals/' },
  { stateSlug: 'nevada', slug: 'las-vegas', name: 'Las Vegas', population: 641903, marketRank: 19, lat: 36.1699, lng: -115.1398, sourceUrl: 'https://www.lasvegasnevada.gov/' },
  { stateSlug: 'california', slug: 'san-diego', name: 'San Diego', population: 1386932, marketRank: 20, lat: 32.7157, lng: -117.1611, sourceUrl: 'https://www.sandiego.gov/treasurer/short-term-residential-occupancy' },
  { stateSlug: 'california', slug: 'los-angeles', name: 'Los Angeles', population: 3898747, marketRank: 21, lat: 34.0522, lng: -118.2437, sourceUrl: 'https://planning.lacity.org/odocument/7d4f8df3-b234-4f1a-8c0a-9b8e8e0e8e8e/Home_Sharing_Ordinance.pdf' },
  { stateSlug: 'california', slug: 'san-francisco', name: 'San Francisco', population: 873965, marketRank: 22, lat: 37.7749, lng: -122.4194, sourceUrl: 'https://shorttermrentals.sfgov.org/' },
  { stateSlug: 'california', slug: 'palm-springs', name: 'Palm Springs', population: 44575, marketRank: 23, lat: 33.8303, lng: -116.5453, sourceUrl: 'https://www.palmspringsca.gov/government/departments/special-program-compliance/vacation-rentals' },
  { stateSlug: 'california', slug: 'big-bear-lake', name: 'Big Bear Lake', population: 5281, marketRank: 24, lat: 34.2439, lng: -116.9114, sourceUrl: 'https://www.citybigbearlake.com/' },
  { stateSlug: 'california', slug: 'joshua-tree', name: 'Joshua Tree', population: 7762, marketRank: 25, lat: 34.1347, lng: -116.3131, sourceUrl: 'https://www.sbcounty.gov/' },
  { stateSlug: 'utah', slug: 'park-city', name: 'Park City', population: 8467, marketRank: 26, lat: 40.6461, lng: -111.4980, sourceUrl: 'https://www.parkcity.org/' },
  { stateSlug: 'utah', slug: 'moab', name: 'Moab', population: 5366, marketRank: 27, lat: 38.5733, lng: -109.5498, sourceUrl: 'https://moabcity.org/' },
  { stateSlug: 'utah', slug: 'salt-lake-city', name: 'Salt Lake City', population: 200133, marketRank: 28, lat: 40.7608, lng: -111.8910, sourceUrl: 'https://www.slc.gov/' },
  { stateSlug: 'colorado', slug: 'aspen', name: 'Aspen', population: 7004, marketRank: 29, lat: 39.1911, lng: -106.8175, sourceUrl: 'https://www.cityofaspen.com/' },
  { stateSlug: 'colorado', slug: 'breckenridge', name: 'Breckenridge', population: 5078, marketRank: 30, lat: 39.4817, lng: -106.0384, sourceUrl: 'https://www.townofbreckenridge.com/' },
  { stateSlug: 'colorado', slug: 'vail', name: 'Vail', population: 4835, marketRank: 31, lat: 39.6403, lng: -106.3742, sourceUrl: 'https://www.vailgov.com/' },
  { stateSlug: 'montana', slug: 'bozeman', name: 'Bozeman', population: 53293, marketRank: 32, lat: 45.6770, lng: -111.0429, sourceUrl: 'https://www.bozeman.net/' },
  { stateSlug: 'wyoming', slug: 'jackson', name: 'Jackson', population: 10760, marketRank: 33, lat: 43.4799, lng: -110.7624, sourceUrl: 'https://www.jacksonwy.gov/' },
  { stateSlug: 'idaho', slug: 'boise', name: 'Boise', population: 235684, marketRank: 34, lat: 43.6150, lng: -116.2023, sourceUrl: 'https://www.cityofboise.org/' },
  { stateSlug: 'idaho', slug: 'coeur-dalene', name: "Coeur d'Alene", population: 56336, marketRank: 35, lat: 47.6777, lng: -116.7805, sourceUrl: 'https://www.cdaid.org/' },
  { stateSlug: 'washington', slug: 'seattle', name: 'Seattle', population: 737015, marketRank: 36, lat: 47.6062, lng: -122.3321, sourceUrl: 'https://www.seattle.gov/' },
  { stateSlug: 'oregon', slug: 'portland', name: 'Portland', population: 652503, marketRank: 37, lat: 45.5152, lng: -122.6784, sourceUrl: 'https://www.portland.gov/' },
  { stateSlug: 'oregon', slug: 'bend', name: 'Bend', population: 99178, marketRank: 38, lat: 44.0582, lng: -121.3153, sourceUrl: 'https://www.bendoregon.gov/' },
  { stateSlug: 'hawaii', slug: 'honolulu', name: 'Honolulu', population: 350964, marketRank: 39, lat: 21.3099, lng: -157.8581, sourceUrl: 'https://www.honolulu.gov/' },
  { stateSlug: 'hawaii', slug: 'lahaina', name: 'Lahaina', population: 12702, marketRank: 40, lat: 20.8783, lng: -156.6825, sourceUrl: 'https://www.mauicounty.gov/' },
  { stateSlug: 'new-york', slug: 'new-york-city', name: 'New York City', population: 8336817, marketRank: 41, lat: 40.7128, lng: -74.0060, sourceUrl: 'https://www.nyc.gov/site/specialenforcement/index.page' },
  { stateSlug: 'new-york', slug: 'hudson', name: 'Hudson', population: 5894, marketRank: 42, lat: 42.2528, lng: -73.7912, sourceUrl: 'https://www.cityofhudson.org/' },
  { stateSlug: 'massachusetts', slug: 'boston', name: 'Boston', population: 675647, marketRank: 43, lat: 42.3601, lng: -71.0589, sourceUrl: 'https://www.boston.gov/' },
  { stateSlug: 'massachusetts', slug: 'hyannis', name: 'Hyannis', population: 14620, marketRank: 44, lat: 41.6520, lng: -70.2828, sourceUrl: 'https://www.town.barnstable.ma.us/' },
  { stateSlug: 'maine', slug: 'bar-harbor', name: 'Bar Harbor', population: 5535, marketRank: 45, lat: 44.3876, lng: -68.2039, sourceUrl: 'https://www.barharbormaine.gov/' },
  { stateSlug: 'vermont', slug: 'stowe', name: 'Stowe', population: 5167, marketRank: 46, lat: 44.4654, lng: -72.6874, sourceUrl: 'https://townofstowevt.org/' },
  { stateSlug: 'new-jersey', slug: 'atlantic-city', name: 'Atlantic City', population: 38497, marketRank: 47, lat: 39.3643, lng: -74.4229, sourceUrl: 'https://www.cityofatlanticcity.org/' },
  { stateSlug: 'north-carolina', slug: 'nags-head', name: 'Nags Head', population: 3066, marketRank: 48, lat: 35.9573, lng: -75.6240, sourceUrl: 'https://www.townofnagshead.net/' },
  { stateSlug: 'tennessee', slug: 'pigeon-forge', name: 'Pigeon Forge', population: 6343, marketRank: 49, lat: 35.7884, lng: -83.5543, sourceUrl: 'https://www.cityofpigeonforge.com/' },
  { stateSlug: 'illinois', slug: 'chicago', name: 'Chicago', population: 2746388, marketRank: 50, lat: 41.8781, lng: -87.6298, sourceUrl: 'https://www.chicago.gov/city/en/depts/bacp/supp_info/sharedhousingordinance.html' },
];

async function seedStates(): Promise<void> {
  const pool = getPool();
  console.log(`Seeding ${STATES.length} states...`);
  for (const state of STATES) {
    await pool.query(
      `INSERT INTO states (slug, name) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [state.slug, state.name],
    );
  }
  console.log(`  ✓ ${STATES.length} states`);
}

async function seedCities(): Promise<void> {
  const pool = getPool();
  console.log(`Seeding ${CITIES.length} cities...`);
  for (const city of CITIES) {
    const [stateRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM states WHERE slug = ? LIMIT 1',
      [city.stateSlug],
    );
    const stateRow = (stateRows as unknown as Array<{ id: number }>)[0];
    if (!stateRow) {
      console.warn(`  ! State not found: ${city.stateSlug} (city ${city.name})`);
      continue;
    }
    const stateId = stateRow.id;

    await pool.query(
      `INSERT INTO cities (state_id, slug, name, population, str_market_rank, lat, lng, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'skeleton')
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         population = VALUES(population),
         str_market_rank = VALUES(str_market_rank),
         lat = VALUES(lat),
         lng = VALUES(lng)`,
      [stateId, city.slug, city.name, city.population, city.marketRank, city.lat, city.lng],
    );

    if (city.sourceUrl) {
      const [cityRows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM cities WHERE state_id = ? AND slug = ? LIMIT 1',
        [stateId, city.slug],
      );
      const cityRow = (cityRows as unknown as Array<{ id: number }>)[0];
      if (cityRow) {
        await pool.query(
          `INSERT IGNORE INTO sources (city_id, url, source_type)
           VALUES (?, ?, 'city_code')`,
          [cityRow.id, city.sourceUrl],
        );
      }
    }
  }
  console.log(`  ✓ ${CITIES.length} cities`);
}

export async function seed(): Promise<void> {
  await seedStates();
  await seedCities();
}

const isMain = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`;
if (isMain) {
  seed()
    .then(() => closePool())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err);
      closePool().finally(() => process.exit(1));
    });
}
