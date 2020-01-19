import { toastr } from "react-redux-toastr";
import fetch from "isomorphic-fetch";
// import TokenUtil from '@/utils/TokenUtil';
import ActionTypes from '@/store/action';
import T from "i18n-react";
// import LanguageUtil from "../utils/LanguageUtil";

const __WS_ROOT__ = '1123'
export default class Api {
  constructor(dispatch, resultType) {
    this.dispatch = dispatch;
    this.resultType = resultType === "text" ? "text" : "json";
    // this.resultType = resultType ?resultType : "json";
  }

  static getEndpoint (endpoint) {
    let wsRoot = typeof window !== 'undefined' ? __WS_ROOT__ : require('../../../env').wsRoot;
    if (wsRoot.length > 0) {
      if (endpoint.indexOf(wsRoot) === 0) {
        return endpoint;
      }

      if (endpoint.indexOf("http://") === 0 || endpoint.indexOf("https://") === 0)
        return endpoint;

      if (endpoint.startsWith("/")) {
        return wsRoot + endpoint;
      } else {
        return wsRoot + "/" + endpoint;
      }
    }

    return endpoint;
  }

  static onSuccess (data) {
    if (data && data.message) {
      toastr.success(data.message);
    }
  }

  static onFailure (data) {
    let message = Api.humanableMessage(data);
    if (message) {
      if (message.indexOf('未登录到系统') >= 0) {
        let isMobile = window.location.href.indexOf('/mobile') >= 0;
        if (isMobile === true) {//如果是微信活动跳转到活动登录页
          window.location.href.indexOf('qx-activity') > 0 ?
            window.location = `/mobile/qx-activity`
            :
            window.location = `/mobile/sign-in`;
        }
        else
          window.location = `/sign-in?lang=zh`;
      }
      else
        toastr.error(message);
    }
  }

  static covert2FormData (plainObject) {
    let form = new FormData();
    for (let key in plainObject) {
      let o = plainObject[key];
      if (o instanceof Array) {
        o.forEach(item => form.append(key, item));
      } else if (o instanceof FileList) {
        if (o.length >= 1)
          form.append(key, o[0], o[0].name);
      } else if (o)
        form.append(key, o);
    }

    return form;
  }

  static humanableMessage (data) {
    let message;
    if (data instanceof TypeError) {
      message = T.translate("rpc.failure");
    } else if (data && data.message) {
      message = data.message;
    } else {
      message = T.translate("rpc.failure");
    }

    return message;
  }

  post (endpoint, body, onSuccess = Api.onSuccess, onFailure = Api.onFailure) {
    this.call(endpoint, "POST", body, onSuccess, onFailure);
  }

  get (endpoint, onSuccess = Api.onSuccess, onFailure = Api.onFailure) {
    this.call(endpoint, "GET", {}, onSuccess, onFailure);
  }

  getWithParams (endpoint, params, onSuccess = Api.onSuccess, onFailure = Api.onFailure) {
    this.call(endpoint, "GET", params, onSuccess, onFailure);
  }

  destroy (endpoint, onSuccess = Api.onSuccess, onFailure = Api.onFailure) {
    this.call(endpoint, "DELETE", {}, onSuccess, onFailure);
  }

  call (endpoint, method, body, onSuccess = Api.onSuccess, onFailure = Api.onFailure) {
    let resultType = this.resultType;
    let dispatch = this.dispatch;
    let headers = {};

    // let token = TokenUtil.token;
    // if (token) {
    //   headers["x-auth-token"] = TokenUtil.token;
    // }

    // endpoint = endpoint + "?lang=" + LanguageUtil.lang;

    this.dispatch({ type: ActionTypes.ON_REQUEST, endpoint, method, body });

    let fetchParams;
    let e = Api.getEndpoint(endpoint);

    if (method === "GET") {
      for (let key in body) {
        if (body[key] instanceof Array) {
          for (let item in body[key]) {
            e += '&' + key + "=" + encodeURIComponent(body[key][item]);
          }
        } else {
          e += '&' + key + "=" + encodeURIComponent(body[key]);
        }
      }

      fetchParams = { method, headers };
    } else {
      if (!(body instanceof FormData)) {
        body = Api.covert2FormData(body);
      }

      fetchParams = { method, headers, body };
    }

    let response;
    fetch(e, fetchParams).then(res => {
      response = res;
      return res.text();
    }).then(text => {
      let result = text;
      if (resultType !== "text" && text !== "") {
        try {
          result = JSON.parse(text);
        } catch (e) {
        }
      }

      if (response.ok) {
        dispatch({ type: ActionTypes.ON_SUCCESS, endpoint, method, body });
        onSuccess(result);
      } else {
        dispatch({ type: ActionTypes.ON_FAILURE, endpoint, method, body });
        onFailure(result);
      }
    }
    ).catch(ex => {
      dispatch({
        type: ActionTypes.ON_FAILURE,
        endpoint, method, body
      });
      onFailure(ex);
    });
  }
}