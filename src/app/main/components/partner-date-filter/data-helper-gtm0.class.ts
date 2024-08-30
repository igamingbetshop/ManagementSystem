export class DateHelperGTM0 {
  static startDate(): [Date, Date] {
    let toDate = DateHelperGTM0.getDateNow();
    toDate.setUTCDate(toDate.getUTCDate() + 1);

    const fromDate = DateHelperGTM0.getDateNow();
    return [fromDate, toDate];
  }

  static selectTime(time: string): [Date, Date] {
    let fromDate = DateHelperGTM0.getDateNow();
    let toDate = DateHelperGTM0.getDateNow();
    toDate.setUTCDate(toDate.getUTCDate() + 1);

    switch (time) {
      case 'today':
        break;
      case 'yesterday':
        fromDate.setUTCDate(fromDate.getUTCDate() - 1);
        toDate = DateHelperGTM0.getDateNow();
        break;
      case 'week':
        const todayWeek = DateHelperGTM0.getDateNow();
        const startOfWeek = new Date(Date.UTC(todayWeek.getUTCFullYear(), todayWeek.getUTCMonth(), todayWeek.getUTCDate() - todayWeek.getUTCDay() + (todayWeek.getUTCDay() === 0 ? -6 : 1)));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        fromDate = startOfWeek;
        toDate = endOfWeek;
        break;
      case 'month':
        const todayMonth = DateHelperGTM0.getDateNow();
        const startOfMonth = new Date(Date.UTC(todayMonth.getUTCFullYear(), todayMonth.getUTCMonth(), 1));
        fromDate = startOfMonth;
        break;
      case 'All Times':
        fromDate = new Date(Date.UTC(1989, 11, 31));
        break;
      case 'LastYear':
        const currentDate = DateHelperGTM0.getDateNow();
        const lastYear = currentDate.getUTCFullYear() - 1;
        const startOfYear = new Date(Date.UTC(lastYear, 0, 1));
        fromDate = startOfYear;
        toDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()));
        break;
    }

    return [fromDate, toDate];
  }

  static getDateNow(): Date {
    const date = new Date();
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    const utcDate = date.toISOString().split('T')[0];
    const d = `${utcDate}T00:00`;
    return new Date(d);
  }
}
