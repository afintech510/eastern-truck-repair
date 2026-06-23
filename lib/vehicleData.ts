export const truckMakes = [
  "Freightliner", "Peterbilt", "Kenworth", "International", "Mack",
  "Volvo", "Hino", "Isuzu", "Ford", "Chevrolet", "RAM", "Western Star",
  "Navistar", "Mitsubishi Fuso", "UD Trucks",
];

export const equipmentMakes = [
  "Caterpillar", "John Deere", "Komatsu", "Kubota", "Bobcat",
  "Case", "Volvo", "Hitachi", "Kobelco", "Takeuchi",
  "Liebherr", "Hyundai", "Doosan", "New Holland", "JCB",
];

export const trailerTypes = [
  "Flatbed", "Dump", "Lowboy", "Reefer", "Dry Van",
  "Landscape", "Utility", "Tanker", "Car Hauler", "Curtainside",
];

export const equipmentTypes = [
  "Excavator", "Wheel Loader", "Backhoe", "Skid Steer", "Dozer",
  "Mini Excavator", "Compact Track Loader", "Telehandler",
  "Crawler Loader", "Motor Grader", "Articulated Dump Truck",
];

export const yearRange = { min: 1990, max: 2027 };

export const years = Array.from(
  { length: yearRange.max - yearRange.min + 1 },
  (_, i) => yearRange.max - i,
);
