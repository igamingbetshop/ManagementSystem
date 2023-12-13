export class DateTimeHelper {

  private static fromDate;
  private static toDate;

  static startDate() {
    let toDate = this.getDateNow();
    toDate.setDate(toDate.getDate() + 1);

    this.fromDate =  this.getDateNow();
    this.toDate = toDate;
  }

  static selectTime(time) {
    let fromDate = this.getDateNow();
    let toDate = this.getDateNow();
    toDate.setDate(toDate.getDate() + 1);

    switch(time) {
      case 'today':
        this.fromDate = fromDate;
        this.toDate = toDate;
        break;
      case 'yesterday':
        fromDate.setDate(fromDate.getDate() - 1);
        this.fromDate = fromDate;
        this.toDate = this.getDateNow();
        break;
      case 'week':
        fromDate.setDate(fromDate.getDate() - 7);
        this.fromDate = fromDate;
        this.toDate = toDate;
        break;
      case 'month':
        fromDate.setMonth(fromDate.getMonth() - 1);
        this.fromDate = fromDate;
        this.toDate = toDate;
        break;
      case 'All Times':
        fromDate.setFullYear(1989, 12, 31);
        this.fromDate = fromDate;
        this.toDate = toDate;
        break;
    }
  }

  static getDateNow() {
    const date =  new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  static getFromDate() {
    return this.fromDate;
  }

  static getToDate() {
    return this.toDate;
  }

}
