export const months: { [key: number]: string } = {
  1: 'ינואר',
  2: 'פברואר',
  3: 'מארס',
  4: 'אפריל',
  5: 'מאי',
  6: 'יוני',
  7: 'יולי',
  8: 'אוגוסט',
  9: 'ספטמבר',
  10: 'אוקטובר',
  11: 'נובמבר',
  12: 'דצמבר',
};
export interface DateMonth extends Date {
  name: string;
  monthNumber: number;
  year:number;
}
export class globalRegex {
  constructor(){}
  static hebLetters = /^[a-zA-Z\u0590-\u05FF\u200f\u200e ]+$/;
  static digits = /[0-9]/;
}