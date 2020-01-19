import ActionTypes from "../constants/ActionTypes";
import Api from "@/utils/Api";
import { toastr } from "react-redux-toastr"; // 第三方弹框插件
import T from "i18n-react";
import push from "@/utils/push.es";
import TokenUtil from "@/utils/TokenUtil.es";
// import AdminRoute from "@/components/admins/AdminRoute";

export function signIn (formData, nextUrl) {
  return dispatch => {
    dispatch({ type: ActionTypes.ADMIN_AUTH_REQUEST });
    new Api(dispatch).post("/admin/tokens", formData, (data, res) => {
      if (data.isAdmin === true) {
        afterSignIn(dispatch, data, res, nextUrl);
      } else {
        toastr.error("您不是管理员！");
        dispatch(getGraphicCode()); //登陆不是admin时重新获取验证码
      }
    }, data => afterSignInFailure(dispatch, data));
  }
}

function afterSignIn (dispatch, info, res, nextUrl) {
  TokenUtil.uid = info.id;
  TokenUtil.token = info.token;

  dispatch({ type: ActionTypes.ADMIN_SIGN_IN, info: info });
  if (nextUrl) dispatch(push(nextUrl));
}

function afterAutoSignIn (dispatch, info, res) {
  TokenUtil.uid = info.id;
  TokenUtil.token = info.token;

  dispatch({ type: ActionTypes.ADMIN_AUTO_SIGN_IN, info: info });
}

function afterSignInFailure (dispatch, result) {
  TokenUtil.uid = undefined;
  TokenUtil.token = undefined;

  let message = Api.humanableMessage(result);
  if (message)
    toastr.error(message);
  dispatch({ type: ActionTypes.Admin_AUTH_FAILURE });
  if (message === '验证码已经失效，请重新获取！')//session失效刷新页面
    window.location.reload();
  else
    dispatch(getGraphicCode()); //登陆报错重新获取验证码
}

function afterAutoSignInFailure (dispatch, result) {
  TokenUtil.uid = undefined;
  TokenUtil.token = undefined;

  dispatch({ type: ActionTypes.Admin_AUTH_FAILURE });
}

export function currentAdminUser () {
  return dispatch => {
    new Api(dispatch).get("/admin/tokens/current", (data, res) => {
      if (data.isAdmin === true) {
        afterAutoSignIn(dispatch, data, res)
      } else {
        // let adminRoute = AdminRoute.adminRoute();
        // this.props.dispatch(push(`/${adminRoute}/sign-in`));
      }
    }, data => afterAutoSignInFailure(dispatch));
  }
}

export function getAdminUserKycs () {
  return dispatch => {
    new Api(dispatch).get("/admin/users/info", (data) => {
      dispatch({ type: ActionTypes.GET_ADMIN_USER_KYC_INFO, data });
    });
  }
}

export function findOrganizationKycs (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams("/admin/kycEnterprise", params, all => {
      dispatch({ type: ActionTypes.GET_ADMIN_ORGANIZATION_KYCS, all });
    });
  }
}

export function sendOrganizationKyc (id, status, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/kycEnterprise/${id}`, { status }, result => {
      dispatch({ type: ActionTypes.SEND_ADMIN_USER_KYC, result });
      toastr.success("企业实名认证已通过");
      onSuccess();
    })
  }
}

export function rejectOrganizationKyc (id, rejectReason, status, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/kycEnterprise/${id}`, { rejectReason, status }, result => {
      dispatch({ type: ActionTypes.SEND_ADMIN_USER_KYC, result });
      toastr.success("企业实名认证未通过，请等候企业反馈");
      onSuccess();
    })
  }
}

export function addOrgAuth (formData, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/kyc/organization`, formData, result => {
      onSuccess();
      toastr.success("新增企业认证成功!");
    })
  }
}

export function findPersonalSource () {
  return dispatch => {
    return new Api(dispatch).get("/admin/kyc/source", all => {
      dispatch({ type: ActionTypes.GET_PERSONAL_SOURCE, all });
    });
  }
}

export function findOrgSource () {
  return dispatch => {
    return new Api(dispatch).get("/admin/kycEnterprise/source", all => {
      dispatch({ type: ActionTypes.GET_ORG_SOURCE, all });
    });
  }
}

export function findAdminUserKycs (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams("/admin/kyc", params, all => {
      dispatch({ type: ActionTypes.GET_ADMIN_USERS_KYCS, all });
    });
  }
}

export function sendUserKyc (id, status, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/kyc/${id}`, { status }, result => {
      dispatch({ type: ActionTypes.ADMIN_USER_KYC, result });
      toastr.success("个人实名认证已通过");
      onSuccess();
    });
  }
}

export function rejectUserKyc (id, rejectReason, status, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/kyc/${id}`, { rejectReason, status }, result => {
      dispatch({ type: ActionTypes.ADMIN_USER_KYC, result });
      toastr.success("个人实名认证未通过");
      onSuccess();
    })
  }
}

export function auditUserKyc (id, data) {
  return dispatch => {
    return new Api(dispatch).get("/admin/users/kyc")
  }
}

export function findUserKycs () {
  return dispatch => {
    return new Api(dispatch).get("/admin/users/kyc", all => {
      dispatch({ type: ActionTypes.GET_ADMIN_USER_KYCS, all });
    });
  }
}

export function findTemplates (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams("/admin/templates", params, all => {
      dispatch({ type: ActionTypes.GET_AUDITING_TEMPLATES, all });
    });
  }
}

export function auditTemplate (templateId, status, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/templates/${templateId}/audit`, { status }, () => {
      dispatch({ type: ActionTypes.AUDIT_TEMPLATE, id: templateId, KycStatus: status });
      onSuccess();
    });
  }
}

export function rejectTemplate (templateId, status, rejectReason, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/templates/${templateId}/audit`, { status, rejectReason }, () => {
      dispatch({ type: ActionTypes.AUDIT_TEMPLATE, id: templateId, rejectReason: rejectReason, KycStatus: status });
      onSuccess();
    });
  }
}

export function findAllAdminUsers (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams("/admin/users", params, users => {
      dispatch({ type: ActionTypes.GET_ADMIN_USERS, users });
    })
  }
}

export function addAdminUser (formData, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post("/admin/users", formData, user => {
      onSuccess();
      toastr.success("成功增加成员");
    });
  }
}

export function editAdminUser (formData, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post("/admin/users/update", formData, user => {
      onSuccess();
      toastr.success("成功更新成员");
    });
  }
}

export function removeAdminUser (id, onSuccess) {
  return dispatch => {
    return new Api(dispatch).destroy(`/admin/users/${id}`, () => {
      dispatch({ type: ActionTypes.REMOVE_ADMIN_USER, userId: id });
      onSuccess();
      toastr.success("成功移除成员");
    });
  }
}

export function findRequest (organizationId, requestId) {
  return dispatch => {
    return new Api(dispatch).get(`admin/api/requests/${organizationId}/${requestId}`, request => {
      dispatch({ type: ActionTypes.GET_API_REQUEST, request });
    });
  }
}

export function findTemplate (templateId) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/templates/${templateId}/info `, template => {
      dispatch({ type: ActionTypes.GET_TEMPLATE_TO_CHANGE_STATE, template });
    });
  }
}

export function changeTemplateState (templateId) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/templates/${templateId}/reset`, {}, template => {
      toastr.success("成功重置模板状态");
      dispatch({ type: ActionTypes.CHANGE_TEMPLATE_STATE, template });
    });
  }
}

export function sendUserConsult (phone, name, verifyCode, email, company, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/consults`, { phone, name, verifyCode, email, company }, consult => {
      if (onSuccess) {
        onSuccess();
      }
      toastr.success("咨询成功");
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

export function getGraphicCode () {
  return dispatch => {
    return new Api(dispatch).get(`/auth/image`, imageCode => {
      dispatch({ type: ActionTypes.GET_GRANPHIC_CODE, imageCode });
    });
  }
}

export function findUserConsults (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/consults`, params, consults => {
      dispatch({ type: ActionTypes.GET_USER_CONSULTS, consults });
    });
  }
}

//用户访问来源统计
export function findUserSource () {
  return dispatch => {
    return new Api(dispatch).get(`/admin/fromCountData`, source => {
      dispatch({ type: ActionTypes.GET_USER_SOURCE, source });
    });
  }
}

//用户邀请好友注册统计(后台注册排序)
export function findUserInvite (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/users/userCount`, params, list => {
      dispatch({ type: ActionTypes.GET_USER_INVITE, list });
    });
  }
}

//用户邀请好友注册统计(后台实名排序)
export function findUserInviteRealName (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/users/userCount/realname`, params, list => {
      dispatch({ type: ActionTypes.GET_USER_INVITE_REALNAME, list });
    });
  }
}

//用户邀请好友注册统计
export function findUserInviteSingle (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/users/findByInviteuseridFA`, params, list => {
      dispatch({ type: ActionTypes.GET_USER_INVITE_SINGLE, list });
    });
  }
}

export function addConsultRemark (data, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/updateConsult`, data, () => {
      dispatch({ type: ActionTypes.GET_CONSULTS_REMARKS, data });
      onSuccess();
      toastr.success("成功更新备注");
    });
  }
}

export function deleteUserConsult (id, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/deleteConsults/${id}`, {}, () => {
      onSuccess();
      toastr.success("成功移除此咨询");
    });
  }
}

export function getNews (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/news`, params, news => {
      dispatch({ type: ActionTypes.GET_ADMIN_NEWS, news });
    });
  }
}

export function deleteNew (id, onSuccess) {
  return dispatch => {
    return new Api(dispatch).destroy(`/admin/news/${id}`, itemId => {
      toastr.success("成功删除新闻");
      dispatch({ type: ActionTypes.DELETE_ADMIN_NEWS, itemId });
      onSuccess();
    });
  }
}

export function addNews (date, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/news`, date, () => {
      toastr.success("成功添加新闻");
      onSuccess();
    });
  }
}

export function publishNews (item, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/news/${item.id}`, {}, result => {
      dispatch({ type: ActionTypes.PUBLISH_NEWS, result });
      toastr.success(result.status == "Publish" ? "发布成功" : "取消发布成功");
      onSuccess();
    });
  }
}

export function getNewsDetail (id) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/news/${id}`, result => {
      dispatch({ type: ActionTypes.GET_NEWS_DETAIL, result });
    });
  }
}

export function getAttestations (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/attestation-list`, params, attestations => {
      dispatch({ type: ActionTypes.GET_ADMIN_ATTESTATIONS, attestations });
    });
  }
}

export function getSignatures (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/eContract-list`, params, signatures => {
      dispatch({ type: ActionTypes.GET_ADMIN_SIGNATURES, signatures });
    });
  }
}

//电子合同查看详情
export function getSignaturesDetail (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/eContract-listByUser`, params, signatures => {
      dispatch({ type: ActionTypes.GET_ADMIN_SIGNATURES_DETAIL, signatures });
    });
  }
}

//获取司法鉴定列表
export function getNotaryList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/notarirsList`, params, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_NOTARY, list });
    });
  }
}

//获取购买公证出证列表
export function getBuyNotarizationList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/purchaseList`, params, list => {
      dispatch({ type: ActionTypes.GET_BUY_NOTARITATION, list });
    });
  }
}

//获取购买公证备注
export function getRemarks (id, onSuccess) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/purchaseRemarkInfo/${id}`, info => {
      if (onSuccess) onSuccess(info);
    });
  }
}

//删除购买公证出证订单
export function deleteBuyNotarization (id, onSuccess) {
  return dispatch => {
    return new Api(dispatch).destroy(`/admin/purchase/${id}`, () => {
      if (onSuccess) onSuccess();
    });
  }
}

//购买公证出证列表 添加备注
export function addBuyNotarizationRemark (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/purchaseRemark`, params, () => {
      if (onSuccess) onSuccess();
      toastr.success('添加备注成功');
    });
  }
}

//查看购买公证订单详情
export function getBuyNotarizationInfo (tradeId) {
  return dispatch => {
    new Api(dispatch).get(`/admin/users/${tradeId}/orderPurchase`, info => {
      dispatch({ type: ActionTypes.GET_BUY_NOTARIZATION_DETAIL, info: info });
    });
  };
}

//查看司法鉴定订单详情
export function getNotaryDetail (tradeId) {
  return dispatch => {
    new Api(dispatch).get(`/admin/notary/${tradeId}`, info => {
      dispatch({ type: ActionTypes.GET_ADMIN_NOTARY_DETAIL, info: info });
    });
  };
}

//查看购买公证订单详情
export function getBuyNotarizationDetail (tradeId) {
  return dispatch => {
    new Api(dispatch).get(`/admin/purchaseDetail/${tradeId}`, info => {
      dispatch({ type: ActionTypes.GET_BUY_NOTARY_DETAIL, info: info });
    });
  };
}

//查看司法鉴定详情
export function postNotarizationDetail (notaryId) {
  return dispatch => {
    new Api(dispatch).get(`/admin/notaryDetail/${notaryId}`, info => {
      dispatch({ type: ActionTypes.GET_ADMIN_NOTARIZATION_DETAIL, info: info });
    });
  };
}

//获取所有的订单列表
export function getAllOrderList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/orderList`, params, list => {
      dispatch({ type: ActionTypes.GET_ALL_ORDER_LIST, list });
    });
  }
}

//取消订单
export function cancelOrder (tradeId, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(getUrl(`/users/${tradeId}/cancel`), {}, list => {
      dispatch({ type: ActionTypes.CANCEL_ADMIN_ORDER, list, tradeId });
      if (onSuccess) onSuccess();
    });
  }
}

//删除司法鉴定订单
export function deleteIdentification (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/deleteNotary`, params, list => {
      dispatch({ type: ActionTypes.DELETE_ADMIN_IDENTIFICATION, params });
      if (onSuccess) onSuccess();
      toastr.success('删除订单成功');
    });
  }
}

//保全管理中订单管理的删除订单
export function deleteOrder (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/deleteOrder`, params, list => {
      dispatch({ type: ActionTypes.DELETE_ADMIN_ORDER, params });
      if (onSuccess) onSuccess();
      toastr.success('删除订单成功');
    });
  }
}

//查看订单详情
export function getAdminOrderDetail (tradeId) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/orderList/${tradeId}`, info => {
      dispatch({ type: ActionTypes.GET_ADMIN_ORDER_DETAIL, info });
    });
  }
}

//修改司法鉴定金额
export function changeAdminOrder (amount, tradeId, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/updateOrder/${tradeId}`, amount, info => {
      dispatch({ type: ActionTypes.CHANGE_ADMIN_ORDER, info: info });
      if (onSuccess) onSuccess();
      toastr.success('修改订单成功');
    });
  }
}

export function getDataCenter (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/admin-count`, params, data => {
      dispatch({ type: ActionTypes.GET_DATA_CENTER, data });
    });
  }
}

export function getDataAttestations (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/attestation-count`, params, data => {
      dispatch({ type: ActionTypes.GET_DATA_ATTESTATIONS, data });
    });
  }
}

export function getDataSignatures (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/eContract-count`, params, data => {
      dispatch({ type: ActionTypes.GET_DATA_SIGNATURES, data });
    });
  }
}

export function gochains (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/gochains`, params, all => {
      dispatch({ type: ActionTypes.GO_CHAINS, all, pageNo: params.pageNo });
      if (onSuccess) onSuccess();
    })
  }
}

export function reSubmitChains (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/reSubmitChains`, params, info => {
      toastr.success('操作成功');
      //dispatch({type: ActionTypes.GO_CHAINS, all, pageNo: params.pageNo});
      if (onSuccess) onSuccess();
    })
  }
}

export function findAllOrgSignAuth (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/orgAuthorization`, params, info => {
      dispatch({ type: ActionTypes.GET_ORG_SIGN_AUTH, info });
    });
  }
}

export function addOrgSignAuth (date, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/orgAuthorization`, date, info => {
      toastr.success("新增授权成功!");
      dispatch({ type: ActionTypes.ADD_ORG_SIGN_AUTH, info });
      onSuccess();
    });
  }
}

export function editOrgSignAuth (date, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/orgAuthorization`, date, info => {
      dispatch({ type: ActionTypes.EDIT_ORG_SIGN_AUTH, info });
      onSuccess();
    });
  }
}

export function editOrgSignStatus (id, status, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/orgAuthorization/${id}`, { status }, info => {
      dispatch({ type: ActionTypes.EDIT_ORG_SIGN_AUTH, info });
      if (onSuccess) onSuccess();
    });
  }
}

export function findAllPackages (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/itemPrice`, params, info => {
      dispatch({ type: ActionTypes.GET_ALL_PACKAGES, info });
    });
  }
}

export function addPackage (date, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/itemPrice`, date, () => {
      toastr.success("成功新增套餐!");
      onSuccess();
    });
  }
}

export function getPackageDetail (id) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/itemPrice/${id}`, info => {
      dispatch({ type: ActionTypes.GET_PACKAGE_ITEM, info });
    });
  }
}

export function deletePackages (id, onSuccess) {
  return dispatch => {
    return new Api(dispatch).destroy(`/admin/itemPrice/${id}`, info => {
      dispatch({ type: ActionTypes.DELETE_PACKAGES, info });
      onSuccess();
    });
  }
}

export function getPending () {
  return dispatch => {
    return new Api(dispatch).get(`/admin/getApply`, data => {
      dispatch({ type: ActionTypes.GET_ADMIN_DPENDING, data });
    });
  }
}

export function getUserCount () {
  return dispatch => {
    return new Api(dispatch).get(`/admin/totalUser`, data => {
      dispatch({ type: ActionTypes.GET_USER_COUNT, data });
    });
  }
}

export function getAttestationsCount (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/all-attestation`, params, data => {
      dispatch({ type: ActionTypes.GET_ATTESTATIONS_COUNT, data });
    });
  }
}

export function getChainCount () {
  return dispatch => {
    return new Api(dispatch).get(`/admin/chain/statistics`, data => {
      dispatch({ type: ActionTypes.GET_CHAIN_COUNT, data });
    });
  }
}

export function getUpperChainCount () {
  return dispatch => {
    return new Api(dispatch).get(`/admin/upper-chain-count`, data => {
      dispatch({ type: ActionTypes.GET_UPPER_CHAIN_COUNT, data });
    });
  }
}

export function getAuthCount () {
  return dispatch => {
    return new Api(dispatch).get(`/admin/realNameUser`, data => {
      dispatch({ type: ActionTypes.GET_AUTH_COUNT, data });
    });
  }
}

export function getProportionData (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/proportion`, params, data => {
      dispatch({ type: ActionTypes.GET_PROPORTION_DATA, data });
    });
  }
}

export function getUserAttCount (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/attestations/statisticsByDayAndMon`, params, data => {
      dispatch({ type: ActionTypes.GET_USER_ATTESTATION_DATA, data });
    });
  }
}

///版权部分
export function getCopyrightBindList (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/findUserBindPfList`, params, list => {
      dispatch({ type: ActionTypes.GET_COPYRIGHT_BIND_LIST, list });
    });
  }
}

//平台审核
export function bindStatus (params, onSuccess, onFailure) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/updateUserBindPfStatus`, params, () => {
      dispatch({ type: ActionTypes.BIND_STATUS, params });
      toastr.success(params.status === 'pass' ? "平台绑定审核通过" : "平台绑定审核未通过");
      onSuccess();
    }, (err) => {
      onFailure();
      toastr.error(err.message);
    })
  }
}

//企业列表
export function getOrgList () {
  return dispatch => {
    return new Api(dispatch).get(`/admin/copyright/queryOrgList`, list => {
      dispatch({ type: ActionTypes.GET_ORG_LIST, list });
    })
  }
}

//获取新闻通知的列表
export function getOriginalNewsList (params) {
  return dispatch => {
    return new Api(dispatch).post(getUrl(`/copyright/cpNewsList`), params, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_ORIGINAL_NEWS_LIST, list: list });
    })
  }
}

//更新新闻状态
export function updateNotice (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/updNewsStatus`, params, data => {
      dispatch({ type: ActionTypes.UPDATE_NOTICE, data })
      onSuccess();
      toastr.success(params.isflag ? params.isflag === '1' ? '发布成功' : '取消发布成功' : params.istop === '1' ? '置顶成功' : '取消置顶成功');
    });
  }
}

//新增新闻
export function addNotice (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/saveNews`, params, () => {
      onSuccess();
      toastr.success(params.id ? "成功修改新闻" : "成功添加新闻");
    })
  }
}

//删除新闻
export function deleteNotice (id, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/delNews/${id}`, {}, () => {
      dispatch({ type: ActionTypes.DELETE_NOTICE, id });
      onSuccess();
      toastr.success("成功删除新闻");
    })
  }
}

//新增企业绑定
export function orgBind (data, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/platformBindByBack`, data, info => {
      onSuccess();
      toastr.success("新增企业绑定成功");
    })
  }
}

//获取维权管理的列表
export function getAdminRightsList (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/queryProtectByBack`, params, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_RIGHTS_LIST, list: list });
    })
  }
}


//获取维权管理前往处理的列表
export function getToRightsList (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/queryPirateByBack`, params, list => {
      dispatch({ type: ActionTypes.GET_TO_RIGHTS_LIST, list: list });
    })
  }
}

//保存侵权方联系方式
export function saveRightsContact (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/savePirateContact`, params, list => {
      dispatch({ type: ActionTypes.CHANGE_ADMIN_RIGHTS_LIST, list: list });
      onSuccess();
      toastr.success("侵权方联系方式维护成功");
    })
  }
}

//获取单个侵权方联系方式
export function getRightsContact (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/queryPirateContact`, params, list => {
      dispatch({ type: ActionTypes.GET_RIGHTS_CONTACT, list });
    })
  };
}

//获取前往处理维权状态列表
export function getRightsStatus () {
  return dispatch => {
    return new Api(dispatch).get(`/admin/copyright/queryProtectCode`, list => {
      dispatch({ type: ActionTypes.GET_RIGHTS_STATUS, list });
    })
  };
}

//获取前往处理流程跟踪
export function getRightsProcess (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/copyright/processTracking`, params, list => {
      dispatch({ type: ActionTypes.GET_RIGHTS_PROCESS, list });
      if (onSuccess) onSuccess(list);
    })
  };
}

//更改维权状态
export function updateProtectByBack (params, flag, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/updateProtectByBack`, params, list => {
      dispatch({ type: ActionTypes.SAVE_RIGHTS_PROGRESS, list: list, flag: flag, params });
      onSuccess();
      toastr.success("维护进度更新成功");
    })
  }
}

//查看维权处理单个详情
export function getRightsDetail (protectId) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/copyright/queryProtectById/${protectId}`, info => {
      dispatch({ type: ActionTypes.GET_RIGHTS_DETAIL, info: info });
    })
  }
}

//生成付费链接
export function getPaymentLink (params, deleteList, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/order/create`, params, info => {
      dispatch({ type: ActionTypes.GET_PAYMENT_LINK, info: info, deleteList: deleteList });
      if (onSuccess) onSuccess();
      toastr.success('生成付费链接成功');
    })
  }
}


//获取订单列表
export function getOrderList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/copyright/order/list`, params, list => {
      dispatch({ type: ActionTypes.GET_ORDER_LIST, list: list });
    })
  }
}

//修改订单
export function changeOrder (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/order/update`, params, info => {
      dispatch({ type: ActionTypes.CHANGE_ORDER, info: info });
      if (onSuccess) onSuccess();
      toastr.success('修改订单成功');
    })
  }
}

//查看订单详情
export function getOrderDetail (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/copyright/order/orderInfo`, params, info => {
      dispatch({ type: ActionTypes.GET_ORDER_DETAIL, info: info });
    })
  }
}

//关闭订单
export function updateOrderPayStatus (params, payStatus, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/order/updatePayStatus`, params, info => {
      dispatch({ type: ActionTypes.UPDATE_COPYRIGHT_ORDER, info: info, payStatus });
      if (onSuccess) onSuccess();
      toastr.success('修改支付状态成功');
    })
  }
}

//导出律师函
export function exportOrderLetter (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/copyright/order/export`, params, info => {
    })
  }
}

//个人-用户内容管理查询列表
export function getArticleByPersonal (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/queryContentByPeople`, params, list => {
      dispatch({ type: ActionTypes.GET_ARTICLE_BY_PERSONSL, list: list });
    })
  }
}

//企业-用户内容管理查询列表
export function getArticleByOrg (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/queryContentByEnterPrise`, params, list => {
      dispatch({ type: ActionTypes.GET_ARTICLE_BY_ORG, list: list });
    })
  }
}

//原创文章管理查询列表
export function getOriginalArticleList (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/myArticleByBack`, params, list => {
      dispatch({ type: ActionTypes.GET_ORIGINAL_ARTICLE, list: list });
    })
  }
}

//侵权文章管理查询列表
export function getTortArticleList (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/copyright/pirateByBack`, params, list => {
      dispatch({ type: ActionTypes.GET_TORT_ARTICLE, list: list });
    })
  }
}

//模版管理部分
//获取企业列表
export function getAdminOrgList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/template/companyList`, params, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_ORG_LIST, list: list });
    })
  }
}

//获取企业产品列表
export function getAdminProductList (organizationId) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/${organizationId}/products`, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_PRODUCT_LIST, list: list });
    })
  }
}

export function getUrl (url) {
  let location = window.location.pathname;
  // let adminRouter = AdminRoute.adminRoute();
  // if (location.indexOf(adminRouter) >= 0) {
  //   url = `/admin` + url;
  // }
  return url;
}

//新增产品
export function createProduct (organizationId, formData, onSuccess) {
  return dispatch => {
    new Api(dispatch).post(getUrl(`/organizations/${organizationId}/products`), formData, () => {
      onSuccess();
      toastr.success(T.translate("actions.create-product"));
    });
  }
}

export function adminUpdateProduct (productId, formData, onSuccess) {
  return dispatch => {
    new Api(dispatch).post(getUrl(`/products/${productId}`), formData, (data) => {
      onSuccess();
      toastr.success(T.translate("actions.update-product"));
    });
  }
}

//删除产品
export function destroyProduct (productId, onSuccess) {
  return dispatch => {
    return new Api(dispatch).destroy(getUrl(`/products/${productId}`), () => {
      dispatch({ type: ActionTypes.DESTROY_ADMIN_PRODUCT, id: productId });
      onSuccess();
      toastr.success(T.translate("actions.destroy-product"));
    })
  }
}

//上线
export function switchProductByAdmin (productId, live) {
  return dispatch => {
    new Api(dispatch).post(getUrl(`/products/${productId}/switch`), { live }, (e) => {
      dispatch({ type: ActionTypes.SWITCH_PRODUCT_BY_ADMIN, live, id: productId });
      if (live)
        toastr.success("产品上线成功");
      else if (!live)
        toastr.success("产品下线成功");
    });
  }
}

//证书时长
export function getCaDuration (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/ca-duration`, params, list => {
      dispatch({ type: ActionTypes.GET_CA_DURATION, list });
    });
  }
}

//删除证书时长
export function deleteCaDuration (id, onSuccess) {
  return dispatch => {
    return new Api(dispatch).destroy(`/admin/ca-duration/${id}`, {}, () => {
      dispatch({ type: ActionTypes.DELETE_CA_DURATION, id });
      onSuccess();
      toastr.success("成功删除证书时长");
    })
  }
}

//新增企业绑定
export function addCertificate (data, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`admin/ca-duration/${data.identNo}/${data.day}`, {}, info => {
      dispatch({ type: ActionTypes.ADD_CA_DURATION, info });
      onSuccess();
      toastr.success("新增证书时长成功");
    })
  }
}

//权限
//获取角色管理列表
export function getRoleList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams("/admin/permission/role/list", params, list => {
      dispatch({ type: ActionTypes.GET_ROLE_LIST, list });
    });
  }
}

//新增岗位
export function addPostRole (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post("/admin/permission/role/add", params, list => {
      onSuccess();
    });
  }
}

//删除岗位
export function deletePostRole (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post("/admin/permission/role/delete", params, list => {
      onSuccess();
    });
  }
}

//编辑岗位名称
export function editPostRole (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post("/admin/permission/role/edit", params, list => {
      toastr.success("岗位名称修改成功");
      onSuccess();
    });
  }
}

//获取角色权限
export function getRoleDetail (id) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/permission/roleAuthority/${id}`, info => {
      dispatch({ type: ActionTypes.GET_ROLE_DETAIL, info });
    });
  }
}

//获取角色权限
export function setRoleAuth (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/permission/setRoleAuthority`, params, info => {
      onSuccess();
      toastr.success("授权成功");
    });
  }
}

//数据保全详情
export function findAttestations (params, isOrg, onSuccess, onFailure) {
  let org = isOrg;//个人用`/admin/attestations/peopleall`，企业用`/admin/attestations/enterprise/upload`
  return dispatch => {
    if (org)
      return new Api(dispatch).post(`/admin/attestations/enterprise/upload`, params, all => {
        dispatch({ type: ActionTypes.FIND_ATTESTATIONS, all, org });
        onSuccess();
      }, (err) => {
        onFailure();
        toastr.error(err.message);
      });
    else
      return new Api(dispatch).getWithParams(`/admin/attestations/peopleall`, params, all => {
        dispatch({ type: ActionTypes.FIND_ATTESTATIONS, all, org });
        onSuccess();
      }, (err) => {
        onFailure();
        toastr.error(err.message);
      });
  }
}


//网页取证详情
export function findUrl (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/attestations/url`, params, all => {
      dispatch({ type: ActionTypes.FIND_URL, all });
    });
  }
}

//证据固定详情
export function findEvidence (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/copyright/pirateArticle`, params, all => {
      dispatch({ type: ActionTypes.FIND_EVIDENCE, all });
    });
  }
}

//过程取证详情
export function findProcess (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/process/list`, params, all => {
      dispatch({ type: ActionTypes.FIND_PROCESS, all });
    });
  }
}

//签署合同详情
export function findSignature (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/signatures`, params, all => {
      dispatch({ type: ActionTypes.FIND_SIGNATURE, all });
    });
  }
}

//企业统计
export function getOrgCount (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/products/totalStatistics`, params, info => {
      dispatch({ type: ActionTypes.GET_ORG_COUNT, info });
    });
  }
}

//上链数量and容量统计
export function getSecurityOfAdmin (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/products/saveStatistics`, params, secStatistics => {
      dispatch({ type: ActionTypes.GET_SEC_STATISTICS_OF_ADMIN, secStatistics });
    });
  }
}

//电子签约统计
export function getApiSignatureByAdmin (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/signatures/api-signCountStatistics`, params, count => {
      dispatch({ type: ActionTypes.GET_API_SIGNATURES_BY_ADMIN, count });
    });
  }
}

//保全条目统计
export function getItemsByAdmin (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/products/productStatistics`, params, itemStatistics => {
      dispatch({ type: ActionTypes.GET_ITEM_STATISTICS_BY_ADMIN, itemStatistics });
    });
  }
}

//获取过程取证列表
export function getProcessEvidence (formData, onSuccess) {
  return dispatch => {
    new Api(dispatch).post(`/admin/processEvidence/findlist`, formData, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_PROCESS_EVIDENCE, list });
      if (onSuccess) onSuccess();
    }
    );
  };
}

//获取网页取证列表
export function getUrlEvidence (formData, onSuccess) {
  return dispatch => {
    new Api(dispatch).post(`/admin/urlEvidence/findlist`, formData, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_URL_EVIDENCE, list });
      if (onSuccess) onSuccess();
    }
    );
  };
}

//过程取证 上传中 审核失败
export function addProcessRemark (formData, onSuccess) {
  return dispatch => {
    new Api(dispatch).post(`/admin/processEvidence/failed`, formData, () => {
      if (onSuccess) onSuccess();
    }
    );
  };
}

//查看过程取证结果
export function getProcessResult (params, onSuccess) {
  return dispatch => {
    new Api(dispatch).getWithParams(`/admin/processEvidence/result`, params, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_PROCESS_RESULT, list, params });
      if (onSuccess) onSuccess();
    }
    );
  };
}

//获取过程取证的取证标签
export function getProcessLabel () {
  return dispatch => {
    new Api(dispatch).get(`/admin/processEvidence/getLabelList`, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_PROCESS_LABEL, list });
    }
    );
  };
}

//获取发票抬头信息列表
export function getInvoiceHead (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/adminInvoice/findAllUserInvoice`, params, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_INVOICE_HEAD, list });
    });
  }
}

//审核发票抬头信息
export function checkInvoiceHead (params, onSuccess, onFailure) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/adminInvoice/auditUserInvoice`, params, () => {
      dispatch({ type: ActionTypes.CHECK_ADMIN_INVOICE_HEAD, params });
      toastr.success(params.checkStatus === "1" ? "发票信息审核通过" : "发票信息审核未通过");
      onSuccess();
    }, (err) => {
      onFailure();
      toastr.error(err.message);
    });
  }
}

//获取发票索取列表
export function getInvoiceAsk (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/adminInvoice/findAllUserInvoiceList`, params, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_INVOICE_ASK, list });
    });
  }
}

//获取单个发票索取信息
export function getInvoiceAskInfo (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/adminInvoice/findUserInvoiceListById`, params, info => {
      dispatch({ type: ActionTypes.GET_ADMIN_INVOICE_ASK_INFO, info });
    });
  }
}

//获取单个发票索取的订单列表
export function getInvoiceAskOrder (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/adminInvoice/findTradeByUserInvoiceListId`, params, list => {
      dispatch({ type: ActionTypes.GET_ADMIN_INVOICE_ASK_ORDER, list });
    });
  }
}

//处理发票索取
export function createInvoiceAsk (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/adminInvoice/dealUserInvoiceList`, params, () => {
      // let adminRouter = AdminRoute.adminRoute();
      // dispatch(push(`/${adminRouter}/finance/invoice/ask`));
      toastr.success('发票索取审核成功')
    });
  }
}

//保全查询
export function searchAttestation (id) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/attestations/${id}/info`, (info) => {
      dispatch({ type: ActionTypes.SEARCH_ATTESTATION, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//用户信息查询页
export function getUserList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/userList`, params, list => {
      dispatch({ type: ActionTypes.GET_USER_LIST, list });
    });
  }
}

//用户信息查询页导出
export function exportUserInfo (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/user/export`, params, info => {
      const blob = new Blob([info], { type: '.xls' });
      const down = document.createElement('a');
      const href = window.URL.createObjectURL(blob);
      down.href = href;
      down.download = "用户信息.xls";
      document.body.appendChild(down);
      down.click();
      document.body.removeChild(down);
      window.URL.revokeObjectURL(href);
    });
  }
}

//用户信息查询 添加备注
export function addUserRealNameRemark (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/updateUserRemark`, params, () => {
      if (onSuccess) onSuccess();
      toastr.success('添加备注成功');
    });
  }
}

//获取过程取证反馈列表
export function getProcessEvidenceFeedBack (formData, onSuccess) {
  return dispatch => {
    new Api(dispatch).post(`/admin/processEvidence/exceplist`, formData, list => {
      dispatch({ type: ActionTypes.GET_PROCESS_EVIDENCE_FEEDBACK, list });
      if (onSuccess) onSuccess();
    }
    );
  };
}

//过程取证反馈审核
export function createProcessEvidenceFeedBack (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/processEvidence/excepAudit`, params, list => {
      dispatch({ type: ActionTypes.CREATE_PROCESS_EVIDENCE_FEEDBACK, list });
      if (onSuccess) onSuccess();
      toastr.success('过程取证反馈审核成功');
    });
  }
}

//查看过程取证反馈信息
export function getProcessFeedBackDetail (formData, onSuccess) {
  return dispatch => {
    new Api(dispatch).getWithParams(`/admin/processEvidence/viewExcepBack`, formData, list => {
      dispatch({ type: ActionTypes.GET_PROCESS_FEEDBACK_DETAIL, list });
      if (onSuccess) onSuccess();
    }
    );
  };
}

//获取网页取证反馈列表
export function getUrlEvidenceFeedBack (formData) {
  return dispatch => {
    new Api(dispatch).getWithParams(`/admin/attachmentUrlFeedback/list`, formData, list => {
      dispatch({ type: ActionTypes.GET_URL_EVIDENCE_FEEDBACK, list });
    }
    );
  };
}

//网页取证反馈详情
export function getUrlEvidenceFeedBackInfo (id) {
  return dispatch => {
    return new Api(dispatch).get(`/admin/attachmentUrlFeedback/${id}`, info => {
      dispatch({ type: ActionTypes.GET_URL_EVIDENCE_DETAIL, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//网页取证反馈审核
export function createUrlEvidenceFeedBack (params, onSuccess, onFailure) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/attachmentUrlFeedback`, params, () => {
      if (onSuccess) onSuccess();
      toastr.success('网页取证反馈审核成功');
    }, (err) => {
      if (onFailure) onFailure();
      toastr.error(err.message);
    });
  }
}

//用户消费查询
export function getConsumption (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/userbalance/list`, params, info => {
      dispatch({ type: ActionTypes.GET_CONSUMPTION, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//双十一活动点击量统计
export function getActivityCount (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/activity/activityRecord`, params, count => {
      dispatch({ type: ActionTypes.GET_ACTIVITY_COUNT, count });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//上传网页取证截图
export function uploadUrlEvidenceImage (formData, attId, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/attachmentUrl/${attId}`, formData, () => {
      if (onSuccess) onSuccess();
      toastr.success('上传截图成功');
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//网页取证失败
export function UrlEvidenceFail (attId, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/attachmentUrl/${attId}/failed`, {}, () => {
      if (onSuccess) onSuccess();
      toastr.success('提交成功');
    });
  }
}

//用户提现列表
export function getCashList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/list/withdraw`, params, list => {
      dispatch({ type: ActionTypes.GET_CASH_LIST, list });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//提现审核
export function editCash (params, onSuccess, onFailure) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/audit/withdraw`, params, list => {
      toastr.success("审核已完成");
      if (onSuccess) onSuccess();
    }, (err) => {
      if (onFailure) onFailure();
      toastr.error(err.message);
    });
  }
}

//金额统计
export function getAmountCount (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/accountBalance`, params, count => {
      dispatch({ type: ActionTypes.GET_AMOUNT_COUNT, count });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//用户使用频率统计
export function getUserFrequencyList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/usageFrequency`, params, count => {
      dispatch({ type: ActionTypes.GET_USER_FREQUENCY_COUNT, count });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//职业使用频率统计
export function getJobFrequencyList (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/careerFrequency`, params, count => {
      dispatch({ type: ActionTypes.GET_JOB_FREQUENCY_COUNT, count });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//季活用户统计
export function getActiveByYear (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/activityCountByjy`, params, info => {
      dispatch({ type: ActionTypes.GET_ACTIVE_YEAR, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//月活用户统计
export function getActiveByMonth (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/activityCountByjy`, params, info => {
      dispatch({ type: ActionTypes.GET_ACTIVE_MONTH, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//周活用户统计
export function getActiveByWeek (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/activityCountByWd`, params, info => {
      dispatch({ type: ActionTypes.GET_ACTIVE_WEEK, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//日活用户统计
export function getActiveByDay (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/activityCountByWd`, params, info => {
      dispatch({ type: ActionTypes.GET_ACTIVE_DAY, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//活跃用户统计-搜索
export function getActiveSearch (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/activityDetails`, params, info => {
      dispatch({ type: ActionTypes.GET_ACTIVE_SEARCH, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//活跃用户统计-导出
export function getActiveExport (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/expActivityDetails`, params, info => {
      const blob = new Blob([info], { type: '.xls' });
      const down = document.createElement('a');
      const href = window.URL.createObjectURL(blob);
      down.href = href;
      down.download = "活跃用户统计.xls";
      document.body.appendChild(down);
      down.click();
      document.body.removeChild(down);
      window.URL.revokeObjectURL(href);
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//监测列表
export function getMonitor (params) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/monitor/list`, params, info => {
      dispatch({ type: ActionTypes.GET_MONITOR, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//监测详情
export function getMonitorUser (id) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/monitor/user/${id}`, {}, info => {
      dispatch({ type: ActionTypes.GET_MONITOR_USER, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//监测管理-手工监测
export function handleToReStart (data, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/monitor/backTask/${data.id}`, data, info => {
      if (onSuccess) onSuccess();
      if (info)
        toastr.success("监测成功");
      else
        toastr.error("监测失败");
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//保全币赠送列表
export function getBQCoin (params) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/rewards`, params, info => {
      dispatch({ type: ActionTypes.GET_BQCOIN, info });
    }, (err) => {
      toastr.error(err.message);
    });
  }
}

//保全币赠送
export function postBQCoin (formData, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/baoquan/rewards`, formData, () => {
      if (onSuccess) onSuccess();
      toastr.success("保全币赠送成功!");
    })
  }
}

//审核状态筛选  
export function ReviewScreen (type, onSuccess) {
  return dispatch => {
    return new Api(dispatch).getWithParams(`/admin/dictionarys`, type, (res) => {
      dispatch({ type: ActionTypes.REVIEWSCREEN, res });
      if (onSuccess) onSuccess(res);
    })
  }
}

//线上购买套餐记录
export function getBuyHistory (params, onSuccess) {
  return dispatch => {
    return new Api(dispatch).post(`/admin/itemPrice/buyHistory`, params, (res) => {
      dispatch({ type: ActionTypes.GETBUTHISTORY, res });
      if (onSuccess) onSuccess(res);
    })
  }
}