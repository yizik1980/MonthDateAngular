import { Component, OnInit } from '@angular/core';
import { DateMonth, globalRegex, months } from '../models/month';

type datePick = 'month' | 'year' | '';
@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss'],
})
export class MonthPickerComponent implements OnInit {
  current: DateMonth = {} as DateMonth;
  monthList = new Array<DateMonth>();
  currentYear = 0;
  years = new Array<number>();
  txt = '';

  monthView: datePick = '';
  constructor() {
    const m = new Date().getMonth() + 1;
    this.current.monthNumber = m;
    this.current.name = months[m];
    this.monthList = Array(12)
      .fill(0)
      .map((s, k) => {
        return { name: months[1 + k], monthNumber: 1 + k } as DateMonth;
      });
    this.currentYear = new Date().getFullYear();
    this.years = Array(11)
      .fill(0)
      .map((s, id) => this.currentYear - 6 + id);
  }
  ngOnInit(): void {}
  open() {
    this.monthView = 'month';
  }
  toggelOpen() {
    this.monthView = 'year';
  }
  close() {
    this.monthView = '';
  }
  clear() {
    this.monthView = '';
  }
  selectMonth(m: DateMonth) {
    this.current = m;
    this.txt = m.name;
    this.monthView = 'year';
  }
  selectYear(y: number) {
    this.currentYear = y;
    this.current.year = y;
    this.txt += ' ' + y;
    this.monthView = '';
  }
  keyupHandler($event: KeyboardEvent) {
    $event.preventDefault();
    const target = ($event.target || $event.srcElement) as HTMLInputElement;
    const keypress = $event.key;
    if (globalRegex.hebLetters.test(keypress)) {
      this.monthList = this.monthList.filter((it) => {
        return new RegExp(target.value).test(it.name);
      });
    }

    if (globalRegex.digits.test(keypress)) {
      this.years = this.years.filter((it) => {
        return new RegExp(target.value).test(it.toString());
      });
    }
  }
}
