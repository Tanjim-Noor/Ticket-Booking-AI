/**
 * Bangladesh Districts
 * Source: context/data.json
 */
export const DISTRICTS = [
  'Dhaka',
  'Chattogram',
  'Khulna',
  'Rajshahi',
  'Sylhet',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'Comilla',
  'Bogra',
] as const;

export type District = typeof DISTRICTS[number];
