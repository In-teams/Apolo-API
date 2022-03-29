import {Request} from "express";

export interface RedeemIndexQuery {
  page?: number;
  per_page?: number;
  include?: any;
  wilayah?: any;
  region?: any;
  distributor?: any;
  area?: any;
  outlet?: any;
  asm?: any;
  ass?: any;
  dates?: string;
  product?: string;
  has_pr?: string;
  sort?: string;
}

export interface AuthorizeRedeemBody {
  transactions: string[];
}

export interface RedeemRequest
    extends Request<any, any, any, RedeemIndexQuery> {
}

export interface AuthorizeRedeemRequest
    extends Request<any, any, AuthorizeRedeemBody, any> {
}
