/**
 * TypeScript Type Definitions
 * These types match the backend Pydantic schemas exactly
 */

// ============ Chat Types ============

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string; // Backend uses 'response', not 'answer'
  conversation_id: string;
  sources: Array<Record<string, any>>;
}

// ============ Bus Types ============

export interface BusSearchParams {
  from_district: string;
  to_district: string;
  travel_date?: string; // ISO date string (YYYY-MM-DD)
  provider?: string;
}

export interface DroppingPoint {
  name: string;
  price: number;
}

export interface BusRoute {
  provider: string;
  from_district: string;
  to_district: string;
  min_price: number;
  max_price: number;
  dropping_points: DroppingPoint[];
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

export interface BusProvidersListResponse {
  providers: BusProvider[];
  total_providers: number;
}

// ============ Booking Types ============

export type BookingStatus = 'confirmed' | 'cancelled' | 'pending';

export interface BookingCreateRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  from_district: string;
  to_district: string;
  provider: string;
  travel_date: string; // ISO date string (YYYY-MM-DD)
  num_seats: number;
  dropping_point?: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  from_district: string;
  to_district: string;
  provider: string;
  travel_date: string; // ISO date string (YYYY-MM-DD)
  num_seats: number;
  dropping_point?: string;
  status: BookingStatus;
  total_fare: number;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export interface BookingListParams {
  customer_email?: string;
  customer_phone?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  total_bookings: number;
}
