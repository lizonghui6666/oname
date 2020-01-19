export default class StringUtil {
  static lpad(str, width, pad) {
    pad = pad || '0';
    str = str + '';

    return str.length >= width ? str : new Array(width - str.length + 1).join(pad) + str;
  }

  static hashCode(str){
    if (Array.prototype.reduce){
      return Math.abs( str.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));
    }
    var hash = 0;
    if (str.length === 0) return hash;
    for (var i = 0; i < str.length; i++) {
      var character  = str.charCodeAt(i);
      hash  = ((hash<<5)-hash)+character;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

}
