export interface MarketCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mi: string;
  fuel: string;
  city: string;
  seller: string;
  sellerName: string;
  hp: string;
  co2: string;
  color: string;
  gearbox: string;
  drive: string;
  equip: string[];
  inspSt: string;
  desc: string;
}

export const MARKET: MarketCar[] = [
  { id: 101, brand: "Tesla", model: "Model Y Long Range", year: 2023, price: 42500, mi: "14,200", fuel: "Electric", city: "Los Angeles, CA", seller: "Dealer", sellerName: "Tesla Burbank", hp: "384 hp", co2: "0 g/mi", color: "Pearl White", gearbox: "1-speed Auto", drive: "AWD", equip: ["Autopilot", "Premium Audio", "Glass Roof", "Heated Seats"], inspSt: "ok", desc: "One owner, excellent condition. Full service history via Tesla app." },
  { id: 102, brand: "BMW", model: "X3 xDrive30i", year: 2022, price: 38900, mi: "28,500", fuel: "Gas", city: "San Diego, CA", seller: "Private", sellerName: "Michael T.", hp: "248 hp", co2: "227 g/mi", color: "Phytonic Blue", gearbox: "8-speed Auto", drive: "AWD", equip: ["M Sport Package", "HUD", "Harman Kardon", "Panoramic Roof"], inspSt: "ok", desc: "M Sport with premium package. No accidents. Garage kept." },
  { id: 103, brand: "Toyota", model: "RAV4 Hybrid XLE", year: 2024, price: 35200, mi: "4,800", fuel: "Hybrid", city: "San Francisco, CA", seller: "Dealer", sellerName: "Toyota of SF", hp: "219 hp", co2: "166 g/mi", color: "Blueprint", gearbox: "CVT", drive: "AWD", equip: ["TSS 3.0", "Wireless CarPlay", "Heated Seats", "Power Liftgate"], inspSt: "ok", desc: "Nearly new with full factory warranty remaining." },
  { id: 104, brand: "Kia", model: "EV6 Wind", year: 2023, price: 36800, mi: "11,600", fuel: "Electric", city: "Portland, OR", seller: "Dealer", sellerName: "Kia of Portland", hp: "320 hp", co2: "0 g/mi", color: "Yacht Blue", gearbox: "1-speed Auto", drive: "AWD", equip: ["V2L", "Remote Smart Parking", "Meridian Audio", "Sunroof"], inspSt: "ok", desc: "800V ultra-fast charging. Excellent range in all conditions." },
  { id: 105, brand: "Ram", model: "1500 Big Horn", year: 2022, price: 39500, mi: "32,100", fuel: "Gas", city: "Phoenix, AZ", seller: "Private", sellerName: "David R.", hp: "395 hp", co2: "283 g/mi", color: "Diamond Black", gearbox: "8-speed Auto", drive: "4WD", equip: ["5.7L HEMI", "Crew Cab", "Bed Liner", "Tow Package"], inspSt: "ok", desc: "Well maintained work truck. Tow package rated for 11,500 lbs." },
  { id: 106, brand: "Honda", model: "CR-V Hybrid Sport Touring", year: 2024, price: 39800, mi: "6,200", fuel: "Hybrid", city: "Phoenix, AZ", seller: "Dealer", sellerName: "Honda of Scottsdale", hp: "204 hp", co2: "195 g/mi", color: "Canyon River Blue", gearbox: "CVT", drive: "AWD", equip: ["Honda Sensing", "Wireless CarPlay", "Heated Leather", "Bose Audio"], inspSt: "ok", desc: "Nearly new CR-V Hybrid. Excellent fuel economy. Factory warranty." },
];

export const WANTED = [
  { id: 301, user: "Sarah J.", want: "Looking for Tesla Model Y, 2022-2024, max 20,000 mi", budget: "Max $42,000", fuel: "Electric", created: "2 days ago", matched: false },
  { id: 302, user: "Eric C.", want: "Looking for Ford F-150 Lariat, 2023+, white or silver", budget: "Max $50,000", fuel: "Gas", created: "5 days ago", matched: true },
  { id: 303, user: "Maria T.", want: "Looking for family SUV, 2022+, max 40k mi, good safety ratings", budget: "Max $35,000", fuel: "Any", created: "1 week ago", matched: false },
  { id: 304, user: "Brian O.", want: "Looking for sports car/GT, max 30,000 mi, automatic", budget: "Max $65,000", fuel: "Any", created: "3 days ago", matched: false },
];

export const COMMUNITY_POSTS = [
  { id: 301, user: { name: "Jake Morrison", av: "J" }, text: "Anyone else notice their Model Y range dropping in cold weather? Getting about 260mi vs the rated 330. Is this normal for winter in Chicago?", likes: 24, comments: 8, time: "2h" },
  { id: 302, user: { name: "Lisa Park", av: "L" }, text: "Just switched from Allstate to State Farm through AIRA — saving $47/month on my CR-V. Same coverage. Why didn't I do this sooner?", likes: 56, comments: 12, time: "4h" },
  { id: 303, user: { name: "Marcus Rodriguez", av: "M" }, text: "PSA: Pep Boys on Wilshire has 20% off brake pads this week. Just got mine done on the F-150, great service as always.", likes: 18, comments: 4, time: "6h" },
  { id: 304, user: { name: "Sarah Kim", av: "S" }, text: "Road trip report: LA to Vegas in the Ioniq 5. One charging stop, 18 min at Electrify America Baker. 800V is a game changer. Total cost: $12.40", likes: 89, comments: 22, time: "8h" },
  { id: 305, user: { name: "Tom Bradley", av: "T" }, text: "Thinking about trading my X3 for a new RAV4 Hybrid. Anyone made a similar switch? How's the reliability comparison?", likes: 31, comments: 15, time: "12h" },
  { id: 306, user: { name: "Nina Patel", av: "N" }, text: "Just hit 100,000 miles on my 2019 Accord. AIRA says it's still worth $14,200. These Hondas hold value like crazy.", likes: 42, comments: 7, time: "1d" },
  { id: 307, user: { name: "Chris Webb", av: "C" }, text: "Installed a tonneau cover on the F-150 and gained about 1.5 MPG on the highway. Best $400 I've spent on this truck.", likes: 67, comments: 19, time: "1d" },
  { id: 308, user: { name: "Emily Chen", av: "E" }, text: "Question for Tesla owners: Is the Full Self-Driving subscription worth $99/mo? I mostly do highway commuting on the 101.", likes: 23, comments: 31, time: "2d" },
];
