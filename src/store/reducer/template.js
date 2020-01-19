import ActionTypes from "../type";
import JSONUtil from "@/utils/JSONUtil";

export default function template (state = { all: [], info: {}, mothers: [], preview: "" }, action) {
  let all;
  let i;
  switch (action.type) {
    case ActionTypes.GET_TEMPLATES:
      return Object.assign({}, state, { all: action.templates.templates, mothers: action.templates.mothers });
    case ActionTypes.GET_TEMPLATE:
      action.info.jsonSchemas = JSONUtil.toObject(action.info.jsonSchemas);
      return Object.assign({}, state, { info: action.info });
    case ActionTypes.NEW_TEMPLATE:
      all = state.all.slice();
      all.unshift(action.info);
      return Object.assign({}, state, { info: action.info, all });
    case ActionTypes.DESTROY_TEMPLATE:
      all = state.all.filter(e => {
        return e.id != action.id
      }
      );
      return Object.assign({}, state, { all });
    case ActionTypes.PREVIEW_TEMPLATE:
      return Object.assign({}, state, { preview: action.preview });
    case ActionTypes.UPDATE_TEMPLATE_TITLE:
      for (i = 0; i < state.all.length; i++) {
        let o = state.all[i];
        if (o.id == action.info.id) {
          state.all[i] = Object.assign({}, o, { title: action.info.title });
        }
      }
      return state;
    case ActionTypes.SUBMIT_TEMPLATE:
      for (i = 0; i < state.all.length; i++) {
        let o = state.all[i];
        if (o.id == action.id) {
          state.all[i] = Object.assign({}, o, { state: "APPROVED" });
        }
      }
      return state;
    default:
      return state;
  }
}
