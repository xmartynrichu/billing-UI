/**
 * Fish Master Module Models
 */

export interface Fish {
  id: number;
  name: string;
  price: number;
  weight: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFishRequest {
  entryby: string;
  fishname: string;
  fishprice: number;
  fishweight: number;
}

export interface UpdateFishRequest extends CreateFishRequest {
  id: number;
}
