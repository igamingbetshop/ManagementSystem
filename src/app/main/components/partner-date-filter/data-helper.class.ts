
export class DateHelper {
  static startDate(): [Date, Date] {
    let toDate = DateHelper.getDateNow();
    toDate.setDate(toDate.getDate() + 2);

    const fromDate = DateHelper.getDateNow();
    return [fromDate, toDate];
  }

  static selectTime(time: string): [Date, Date] {
    let fromDate = DateHelper.getDateNow();
    let toDate = DateHelper.getDateNow();
    toDate.setDate(toDate.getDate() + 2);

    switch (time) {
      case 'today':
        break;
      case 'yesterday':
        fromDate.setDate(fromDate.getDate() - 1);
        toDate = DateHelper.getDateNow();
        break;
      case 'week':
        const todayWeek = DateHelper.getDateNow();
        const startOfWeek = new Date(todayWeek);
        startOfWeek.setDate(todayWeek.getDate() - todayWeek.getDay() + (todayWeek.getDay() === 0 ? -6 : 1));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        fromDate = startOfWeek;
        toDate = endOfWeek;
        break;
      case 'month':
        const todayMonth = DateHelper.getDateNow();
        const startOfMonth = new Date(todayMonth.getFullYear(), todayMonth.getMonth(), 1);
        fromDate = startOfMonth;
        break;
      case 'All Times':
        fromDate = new Date(1989, 11, 31);
        break;
      case 'LastYear':
        const currentDate = DateHelper.getDateNow();
        const lastYear = currentDate.getFullYear() - 1;
        const startOfYear = new Date(lastYear, 0, 1);
        fromDate = startOfYear;
        toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        break;
    }

    return [fromDate, toDate];
  }

  static getDateNow(): Date {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
}