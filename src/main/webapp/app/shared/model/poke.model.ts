export interface IPoke {
  id?: number;
  heartTime?: string;
  mailTime?: string;
  vacaTime?: string;
}

export class Poke implements IPoke {
  constructor(public id?: number, public heartTime?: string, public mailTime?: string, public vacaTime?: string) {}
}
