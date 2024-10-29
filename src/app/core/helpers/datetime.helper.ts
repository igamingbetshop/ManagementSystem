export class DateTimeHelper {

  private static fromDate: Date;
  private static toDate: Date;

  static startDate() {
    let toDate = this.getDateNow();
    toDate.setDate(toDate.getDate() + 1);

    this.fromDate = this.getDateNow();
    this.toDate = toDate;
  }

  static selectTime(time) {
    let fromDate = this.getDateNow();
    let toDate = this.getDateNow();
    toDate.setDate(toDate.getDate() + 1);

    switch (time) {
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
        fromDate.setFullYear(2015, 3, 1);
        this.fromDate = fromDate;
        this.toDate = toDate;
        break;
    }
  }

  static getDateNow() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return date;
  }

  static getFromDate() {
    return this.fromDate;
  }

  static getToDate() {
    return this.toDate;
  }

}
