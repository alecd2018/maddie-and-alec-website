export interface IEvent {
  id?: number;
  startDate?: string;
  endDate?: string;
  description?: string;
  type?: string;
}

export class Event implements IEvent {
  constructor(public id?: number, public startDate?: string, public endDate?: string, public description?: string, public type?: string) {}
}
