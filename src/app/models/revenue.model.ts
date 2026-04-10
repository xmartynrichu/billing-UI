/**
 * Revenue Module Models
 */

export interface Revenue {
  id: number;
  entryby: string;
  entrydate: Date;
  fishname: string;
  fishqty: number;
  fishsold: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRevenueRequest {
  entryby: string;
  entrydate: Date;
  fishname: string;
  fishqty: number;
  fishsold: number;
}

export interface UpdateRevenueRequest extends CreateRevenueRequest {
  id: number;
}
