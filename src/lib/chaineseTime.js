

export function chaineseTime(date) {
  var dateStr = date.slice(0, 10);

  var dict = {
    "0": "0",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六",
    "7": "七",
    "8": "八",
    "9": "九",
    "10": "十",
    "11":"十一",
    "12":"十二",
    "13":"十三",
    "14":"十四",
    "15":"十五",
    "16":"十六",
    "17":"十七",
    "18":"十八",
    "19":"十九",
    "20":"二十",
    "21":"二十一",
    "22":"二十二",
    "23":"二十三",
    "24":"二十四",
    "25":"二十五",
    "26":"二十六",
    "27":"二十七",
    "28":"二十八",
    "29":"二十九",
    "30":"三十",
    "31":"三十一"
  };

  var date = dateStr.split('-'),
    yy = date[0],
    mm = date[1],
    dd = date[2];

  var yearStr = dict[yy[0]] + dict[yy[1]] + dict[yy[2]] + dict[yy[3]] + '年',
    monthStr = dict[''+Number(mm)] + '月',
    dayStr = dict[dd];

  return(yearStr +monthStr +dayStr);
}