// import ActionTypes from './type';
// import Api from '@/utils/Api';
// import { message } from 'antd'
// import { getUrl } from "./adminAction.js";

// export function submitTemplate (templateId) {
//   return dispatch => {
//     new Api(dispatch).post(getUrl(`/templates/${templateId}/submit`), {}, () => {
//       dispatch({ type: ActionTypes.SUBMIT_TEMPLATE, id: templateId });
//     });
//   }
// }

// export function getTemplates (productId) {
//   return dispatch => {
//     new Api(dispatch).get(getUrl(`/products/${productId}/templates`), templates => {
//       dispatch({ type: ActionTypes.GET_TEMPLATES, templates });
//     });
//   }
// }

// export function destroyTemplate (templateId) {
//   return dispatch => {
//     new Api(dispatch).destroy(getUrl(`/templates/${templateId}`), () => {
//       message.success('111');
//       dispatch({ type: ActionTypes.DESTROY_TEMPLATE, id: templateId });
//     });
//   }
// }

// export function updateTemplate (templateId, formData) {
//   return dispatch => {
//     new Api(dispatch).post(getTempUrl(`/templates/${templateId}`), formData, () => {
//       message.success('222');
//     });
//   }
// }

// export function previewTemplate (formData) {
//   return dispatch => {
//     new Api(dispatch).post(getUrl(`/templates/preview`), formData, preview => {
//       dispatch({ type: ActionTypes.PREVIEW_TEMPLATE, preview });
//     });
//   }
// }

// export function createTemplate (productId, templateId, onSuccess) {
//   return dispatch => {
//     new Api(dispatch).post(getUrl(`/products/${productId}/templates`), { templateId }, (info) => {
//       message.success('333');
//       dispatch({ type: ActionTypes.NEW_TEMPLATE, info });
//     }
//     )
//   }
// }

// export function getTemplate (templateId) {
//   return dispatch => {
//     new Api(dispatch).get(getTempUrl(`/templates/${templateId}`), info => {
//       dispatch({ type: ActionTypes.GET_TEMPLATE, info });
//     });
//   }
// }

// export function getTempUrl (url) {
//   let search = window.location.search;
//   if (search === "?fromAdmin=true") {
//     url = `/admin` + url;
//   }
//   return url;
// }

// export function updateTitle (templateId, title) {
//   return dispatch => {
//     new Api(dispatch).post(getUrl(`/templates/${templateId}/title`), { title }, () => {
//       dispatch({ type: ActionTypes.UPDATE_TEMPLATE_TITLE, info: { title, id: templateId } });
//       message.success(`444${title}`);
//     });
//   }
// }

// export function cloneTemplate (templateId) {
//   return dispatch => {
//     new Api(dispatch).post(`/templates/${templateId}/clone`);
//   }
// }