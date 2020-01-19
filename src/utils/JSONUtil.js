export default class JSONUtil {
  static toObject (str) {
    try {
      return JSON.parse(str);
    } catch (ex) {
      return {};
    }
  }
}