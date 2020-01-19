export default class Context {
  constructor(value) {
    this.value = value ;
    this.out = '' ;
  }

  beginColor(color) {
    this.out += `<span style='color:${color}'>` ;
  }

  endColor(color) {
    this.out += `</span>` ;
  }

  puts(text) {
    this.out += text ;
  }
}