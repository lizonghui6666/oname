export default class ActivityType {

  static showActivityType = (type) => {
    switch (type){
      case "Banner":
        return "Banner";
      case "SignIn":
        return "注册登陆";
      case "Attestation":
        return "保全";
      case "UrlEvidence":
        return "网页取证半价";
      case "ProcessEvidence":
        return "过程取证";
      case "Recharge":
        return "充值翻倍";
      default:
        return "——";
    }
  };
}