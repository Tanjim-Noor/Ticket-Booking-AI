/**
 * TypeScript Type Definitions
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}

export interface BusRoute {
  provider: string;
  from_district: string;
  to_district: string;
  estimated_fare: number;
  description: string;
}

export interface BusSearchResponse {
  routes: BusRoute[];
  total_results: number;
}

export interface BusProvider {
  name: string;
  coverage_districts: string[];
  details?: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  from_district: string;
  to_district: string;
  provider: string;
  travel_date: string;
  num_seats: number;
  dropping_point?: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  total_fare: number;
  created_at: string;
  updated_at: string;
}

export interface BookingCreateRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  from_district: string;
  to_district: string;
  provider: string;
  travel_date: string;
  num_seats: number;
  dropping_point?: string;
}
