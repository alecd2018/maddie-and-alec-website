export interface ICoupon {
  id?: number;
}

export class Coupon implements ICoupon {
  constructor(public id?: number) {}
}
