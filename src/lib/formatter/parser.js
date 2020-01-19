export class Token {
  static BREAK = 1;
  static NUMBER = 2;
  static TEXT = 3;
  static DATETIME = 4;
  static SPECIAL = 5;
  static GENERAL = 6;

  constructor(type, token) {
    this.type = type;
    this.token = token;
  }
}

export class Parser {
  static EOF = -1;

  constructor(formatString) {
    this.formatString = formatString;
    this.size = formatString.length;
  }

  putNonTextToken(type, value) {
    this.putTextToken();
    this.tokens.push(new Token(type, value))
  }

  putTextToken() {
    if (this.last != '') {
      this.tokens.push(new Token(Token.TEXT, this.last));
      this.last = '';
    }
  }

  tokens() {
    this.chars = this.formatString.split('');
    this.pos = 0;
    this.tokens = [];
    this.last = '';

    c = this.current();

    while (c != Parser.EOF) {
      switch (c) {
        case ';' :
          this.putNonTextToken(Token.BREAK, ';');
          this.skip(1);
          break;
        case '\\' :
          this.skip(1);
          if (this.current() != Parser.EOF)
            this.last += this.current();
          this.skip(1);
          break;
        case 'g' :
          this.putNonTextToken(Token.GENERAL, 'g');
          this.skip(1);
          break;
        case '#' :
        case ',' :
        case '0' :
        case '%' :
        case '.' :
        case 'w' :
          this.putNonTextToken(Token.NUMBER, c);
          this.skip(1);
          break;
        case 'y' :
          if (this.lookup(1) == 'y' &&
            this.lookup(2) == 'y' &&
            this.lookup(3) == 'y' ) {
            this.putNonTextToken(Token.DATETIME, c + c);
            this.skip(4);
          }
          else {
            this.putNonTextToken(Token.DATETIME, c);
            this.skip(2);
          }
          break;
        case 'm' :
        case 'd' :
        case 'h' :
        case 'M' :
        case 's' :
          if (this.lookup(1) == c) {
            this.putNonTextToken(Token.DATETIME, c + c);
            this.skip(2);
          } else {
            this.putNonTextToken(Token.DATETIME, c);
            this.skip(1);
          }
          break ;
        case '[' :
          this.skip(1);
          var l = '';
          for (var c = this.current(); c != Parser.EOF && c != ']'; c = this.current()) {
            l += c;
            this.skip(1);
          }

          this.skip(1);
          this.putNonTextToken(Token.SPECIAL, l);
          break ;
        default:
          if (c != Parser.EOF) {
            this.last += c ;
          }
          this.skip(1);
      }

      c = this.current();
    }

    this.putTextToken() ;
    return this.tokens;
  }

  lookup(ahead) {
    if (this.pos + ahead >= this.size)
      return Parser.EOF;

    return this.chars[this.pos + ahead];
  }

  current() {
    if (this.pos >= this.size)
      return Parser.EOF;
    return this.chars[this.pos];
  }

  skip(count) {
    this.pos += count;
  }
}


