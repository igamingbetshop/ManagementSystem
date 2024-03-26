export class DateHelper {
    static startDate(): [Date, Date] {
      let toDate = DateHelper.getDateNow();
      toDate.setDate(toDate.getDate() + 1);
  
      const fromDate = DateHelper.getDateNow();
      return [fromDate, toDate];
    }
  
    static selectTime(time: string): [Date, Date] {
      let fromDate = DateHelper.getDateNow();
      let toDate = DateHelper.getDateNow();
      toDate.setDate(toDate.getDate() + 1);
  
      switch (time) {
        case 'today':
          break;
        case 'yesterday':
          fromDate.setDate(fromDate.getDate() - 1);
          toDate = DateHelper.getDateNow();
          break;
        case 'week':
          fromDate.setDate(fromDate.getDate() - 7);
          break;
        case 'month':
          fromDate.setMonth(fromDate.getMonth() - 1);
          break;
        case 'All Times':
          fromDate.setFullYear(1989, 11, 31);
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