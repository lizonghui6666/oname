import Context from './Context' ;
import { Parser, Token } from './parser' ;

export default class Formatter {
  static NUMBER = 0;
  static DATETIME = 1;

  static get(formatString) {
    let formatter = new FormatterGroup();
    formatter.readTokens(new Parser(formatString).tokens());
    return formatter;
  }
}

class FormatterGroup {
  isNumeric(n) {
    return !isNaN(parseFloat(n))&&isFinite(n) ;
  }

  format(value) {
    if (value==undefined || value==null)
      return '';
    if( this.formatter.type == Formatter.NUMBER) {
      value = parseFloat(value.toString()) ;
      if( !this.isNumeric(value)) {
        return '' ;
      }
    } else if ( this.formatter.type == Formatter.DATETIME ) {
      if( this.isNumeric(value)) {
        value = new Date(parseFloat(value));
      } else {
        value = new Date(value) ;
      }
      if( isNaN(value.getFullYear())) {
        return '' ;
      }
    }

    if (this.ltZeroFormatter && value < 0) {
      return this.ltZeroFormatter.format(value);
    }

    if (this.zeroFormatter && this.value == 0) {
      return this.zeroFormatter.format(value);
    }

    return this.formatter.format(value);
  }

  readTokens(tokens) {
    this.formatter = new InternalFormatter();
    this.formatter.showSign = true;

    let remainTokens = this.formatter.readTokens(tokens);
    if (remainTokens) {
      let f2 = new InternalFormatter();
      f2.showSign = false;
      remainTokens = f2.readTokens(remainTokens);

      if (remainTokens) {
        this.zeroFormatter = f2;
        this.ltZeroFormatter = new InternalFormatter();
        this.ltZeroFormatter.showSign = false;
        this.ltZeroFormatter.readTokens(remainTokens);
      } else
        this.ltZeroFormatter = f2;
    }
  }
}

class InternalFormatter {

  fractionLen() {
    this._fractionLen = this._fractionLen || ( this.dotPosition ? this.numberPlaceholder - this.dotPosition : 0 );
    return this._fractionLen;
  }

  integerLen() {
    this._integerLen = this._integerLen || ( this.dotPosition ? this.dotPosition : this.numberPlaceholder );
    return this._integerLen;
  }

  format(value) {
    let ctx = new Context(value);

    this.segments.map((x) => {
      x.beginOutput(ctx);
    });

    this.segments.map((x) => {
      x.output(ctx);
    });

    this.segments.map((x) => {
      x.endOutput(ctx);
    });

    return ctx.out;
  }

  readTokens(tokens) {
    this.segments = [];
    this.numberPlaceholder = 0;

    for (let pos = 0; pos < tokens.length; pos++) {
      let current = tokens[pos];
      switch (current.type) {
        case Token.GENERAL:
          this.segments.push(new GeneralSegment().set(this));
          break;
        case Token.TEXT:
          this.segments.push(new TextSegment(current.token).set(this));
          break;
        case Token.NUMBER:
          this.type = this.type || Formatter.NUMBER;
          switch (current.token) {
            case 'w':
              this.chineseWan = true;
              break;
            case ',' :
              this.thousandSymbol = true;
              break;
            case '%' :
              this.percentSymbol = true;
              break;
            case '.':
              this.dotPosition = this.numberPlaceholder;
              break;
            case '0' :
            case '#' :
              this.segments.push(new NumberSegment(current.token, this.numberPlaceholder).set(this));
              this.numberPlaceholder++;
              break;
          }
          break;
        case Token.DATETIME:
          this.type = this.type || Formatter.DATETIME;
          this.segments.push(new DateTimeSegment(current.token).set(this));
          break;
        case Token.SPECIAL:
          this.segments.push(new WrapperSegment(current.token).set(this));
          break;
        case Token.BREAK:
          return tokens.splice(pos + 1, tokens.length);

      }
    }
  }
}


class BaseSegment {
  set(formatter) {
    this.formatter = formatter
    return this;
  }

  output(context) {
  }

  beginOutput(context) {
  }

  endOutput(context) {
  }
}

class NumberSegment extends BaseSegment {
  constructor(placeholder, position) {
    super();

    this.placeholder = placeholder;
    this.position = position;
  }


  initialOutput(context) {
    if (this.position != 0)
      return;

    let value = undefined;

    if (this.formatter.chineseWan)
      value = Math.abs(context.value) / 10000.00;
    else if (this.formatter.percentSymbol)
      value = Math.abs(context.value) * 100.00;
    else
      value = Math.abs(context.value);

    let numbers = value.toFixed(this.formatter.fractionLen()).split('.');

    if (numbers[0])
      context.integerDigits = new Array(...numbers[0]);

    if (numbers[1])
      context.fractionDigits = new Array(...numbers[1]);


    if (context.value < 0 && this.formatter.showSign)
      context.puts('-');

    let digits = context.integerDigits;
    if (digits.length > this.formatter.integerLen()) {
      for (let i = 0; i <= digits.length - this.formatter.integerLen() - 1; i++) {
        context.puts(digits[i])

        let l = digits.length - i;
        if (this.formatter.thousandSymbol &&
          l % 3 == 1 && l != 1) {
          context.puts(',')
        }
      }
    }
  }

  fractionOutput(context) {
    if (!this.formatter.dotPosition || this.position < this.formatter.dotPosition)
      return;

    let digits = context.fractionDigits;
    let c = digits[this.position - this.formatter.integerLen()];

    if (this.placeholder == '0') {
      if (this.position == this.formatter.dotPosition)
        context.puts('.');
      context.puts(!c ? '0' : c);
    } else {
      if (this.position == this.formatter.dotPosition && c != '0')
        context.puts('.');
      context.puts(!c || c == '0' ? '' : c
      )
      ;
    }
  }

  integerOutput(context) {
    if (this.formatter.dotPosition && this.position >= this.formatter.dotPosition)
      return;
    let digits = context.integerDigits;
    let pos = digits.length - this.formatter.integerLen() + this.position;
    let c = ( pos >= 0 ) ? digits[pos] : null;

    if (this.placeholder == '#') {
      context.puts(!c ? '' : c);
    } else {
      context.puts(!c ? '0' : c);
    }

    let l = this.formatter.integerLen() - this.position;
    if (c && this.formatter.thousandSymbol &&
      l % 3 == 1 && l != 1)
      context.puts(',')
  }

  output(context) {
    this.initialOutput(context);
    this.integerOutput(context);
    this.fractionOutput(context);
    this.finalOutput(context);
  }

  finalOutput(context) {
    if (this.formatter.numberPlaceholder - 1 != this.position)
      return;

    if (this.formatter.chineseWan)
      context.puts('万');
    else if (this.formatter.percentSymbol) {
      context.puts('%');
    }
  }
}

class DateTimeSegment extends BaseSegment {
  constructor(seg) {
    super();
    this.part = seg[0];
    this.len = seg.length;
  }

  output(context) { // 时间格式化
    let value = context.value;

    let n = 0;
    switch (this.part) {
      case 'y' :
        n = value.getFullYear();
        break;
      case  'm' :
        n = value.getMonth() + 1 ;
        break;
      case  'd' :
        n = value.getDate();
        break;
      case 'h' :
        n = value.getHours();
        break;
      case  'M' :
        n = value.getMinutes();
        break;
      case 's' :
        n = value.getSeconds();
    }
    if (this.part == 'y')
      context.puts(this.len == 2 ? n : n % 100);
    else
      context.puts(`${n.toString().length == 1 && this.len == 2 ? '0' : '' }${n}`)
  }
}
class GeneralSegment extends BaseSegment {
  output(context) {
    context.puts(context.value);
  }
}

class TextSegment extends BaseSegment {

  constructor(text) {
    super();
    this.text = text;
  }

  output(context) {
    context.puts(this.text);
  }
}

class WrapperSegment extends BaseSegment {
  static colorMap;

  static initColorMap() {
    WrapperSegment.colorMap = {} ;

    let enColorNames = [ "black" , "silver" ,  "gray" , "pink" ,  "maroon" ,
                         "red" , "purple" , "fuchsia" , "green" , "lime" ,
                         "olive" , "yellow" , "navy" , "blue" , "teal",  "aqua" , "orange", "brown" ];
    let zhColorNames = [ "黑色" ,"银色" , "灰色" ,"粉红" , "茶色" ,
                         "红色" , "紫色","紫红","绿色","亮绿",
                        "橄榄","黄色","深蓝","蓝色", "青色","浅绿", "橙色", "褐色" ] ;

    zhColorNames.map((item, index)=> {
      WrapperSegment.colorMap[item] = enColorNames[index];
    });

    enColorNames.map((item) => {
      WrapperSegment.colorMap[item] = item;
    });
  }

  static colorName(value) {
    if (value.startsWith('#')) {
      return value;
    }

    if( !WrapperSegment.colorMap ) {
      WrapperSegment.initColorMap() ;
    }

    let color = WrapperSegment.colorMap[value];
    if (color)
      return color;

    return value;
  }

  constructor(special) {
    super();
    this.special = special;
  }

  beginOutput(context) {
    context.beginColor(WrapperSegment.colorName(this.special));
  }

  endOutput(context) {
    context.endColor();
  }

}

