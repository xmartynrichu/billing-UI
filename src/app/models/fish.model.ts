/**
 * Fish Master Module Models
 */

export interface Fish {
  id: number;
  fish_name: string;
  fish_price: string | number;
  fish_weight: string | number;
  createdby?: string;
  createdat?: string;
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
