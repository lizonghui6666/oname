export function dataFormData (data) {
  let str = '';
  for (let k in data) {
    str = str + k + '=' + data[k] + '&';
  }
  return str.slice(0, str.length - 1);
}

export function timeFormat (time) {
  let d = new Date(time);

  let year = d.getFullYear();       //年  
  let month = d.getMonth() + 1;     //月  
  let day = d.getDate();            //日  

  let hh = d.getHours();            //时  
  let mm = d.getMinutes();          //分  
  let ss = d.getSeconds();           //秒  

  let clock = year + "/";

  if (month < 10)
    clock += "0";

  clock += month + "/";

  if (day < 10)
    clock += "0";

  clock += day + " ";

  if (hh < 10)
    clock += "0";

  clock += hh + ":";
  if (mm < 10) clock += '0';
  clock += mm + ":";

  if (ss < 10) clock += '0';
  clock += ss;
  return (clock);
}