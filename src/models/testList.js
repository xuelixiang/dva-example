import modelExtend from 'dva-model-extend'
import { query } from 'services/testList'
import { pageModel } from './common'
import queryString from 'query-string'

export default modelExtend(pageModel, {

  namespace: 'testList',

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/navigation/navigation2/navigation2/testList') {
          dispatch({
            type: 'query',
            payload: {
              status: 2,
              ...queryString.parse(location.search),
            },
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if(data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              total: data.total,
              pageSize: Number(payload.pageSize) || 10,
            },
          },
        })
      } else {
        throw data
      }
    },
  },


})