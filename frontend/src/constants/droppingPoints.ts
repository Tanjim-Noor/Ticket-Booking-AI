export interface DroppingPoint {
  name: string;
  price: number;
}

export const DROPPING_POINTS: Record<string, DroppingPoint[]> = {
  'Dhaka': [
    { name: 'Gabtoli', price: 500 },
    { name: 'Mohakhali', price: 550 },
    { name: 'Sayedabad', price: 520 }
  ],
  'Chattogram': [
    { name: 'Muradpur', price: 600 },
    { name: 'Agrabad', price: 650 },
    { name: 'Kaptai', price: 620 }
  ],
  'Khulna': [
    { name: 'Daulatpur', price: 400 },
    { name: 'Khalishpur', price: 420 }
  ],
  'Rajshahi': [
    { name: 'Shiroil', price: 450 },
    { name: 'Vodra', price: 470 }
  ],
  'Sylhet': [
    { name: 'Kadamtoli', price: 500 },
    { name: 'Sobhanighat', price: 520 }
  ],
  'Barishal': [
    { name: 'Nathullabad', price: 350 },
    { name: 'Rupatali', price: 370 }
  ],
  'Rangpur': [
    { name: 'Modern Mor', price: 550 },
    { name: 'Terminal', price: 500 }
  ],
  'Mymensingh': [
    { name: 'Maskanda', price: 300 },
    { name: 'Bridge Mor', price: 320 }
  ],
  'Comilla': [
    { name: 'Paduar Bazar', price: 200 },
    { name: 'Jangalia', price: 220 }
  ],
  'Bogra': [
    { name: 'Charmatha', price: 400 },
    { name: 'Thanthania', price: 420 }
  ]
};
