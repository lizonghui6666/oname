export default class TradeType {

  static tradeStyle = (type) => {
    switch (type) {
      case "ALIPAY":
        return "支付宝支付";
      case "OUT":
        return "余额支付";
      case "IN":
        return "支付宝支付";
      case "WXPAY":
        return "微信支付";
      case "REWARD":
        return "活动赠送";
      case "":
        return "余额支付";
      case 'SIPCPAY':
        return 'SIPC支付';
    }
  };

}