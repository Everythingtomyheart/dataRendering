import type { AxiosRequestConfig, Method } from 'axios';
import Axios from 'axios';
import userStore from '@/store/modules/user';
import { isProd } from '../is';
import { message as Message } from 'antd';
import { history } from 'umi';

import { BfrModal } from '@/components/modal';
import { apiUrl, sysApiUrl } from '@/config/config';
// 请求拦截器
export type ResponseResult<T> = {
  err: { message: string; name: 'user' | 'system' } | null;
  data: T;
  ok: boolean;
};
export type Result<T> = Promise<ResponseResult<T>>;
type RequestMethod = <T>(url: string, data?: any, opt?: AxiosRequestConfig) => Result<T>;
interface Request {
  <T>(url: string, method: Method, data?: any, opt?: AxiosRequestConfig): Result<T>;
  list: RequestMethod;
  get: RequestMethod;
  post: RequestMethod;
  put: RequestMethod;
  delete: RequestMethod;
  patch: RequestMethod;
}
const errorMessage: Record<number, string> = {
  500: '服务器内部错误',
  400: '请求参数错误',
  504: '网关错误',
  404: '请求不存在'
};
const MessageDuration = 2;
let defaultSource = Axios.CancelToken.source();
history.listen(() => {
  defaultSource.cancel('切换路由取消请求');
  defaultSource = Axios.CancelToken.source();
});
const createRequest = (config: AxiosRequestConfig) => {
  const axiosInstance = Axios.create({ timeout: 60000, ...config });
  axiosInstance.interceptors.request.use(
    (reqConfig) => {
      if (config.cancelToken === undefined) {
        config.cancelToken = defaultSource.token;
      }
      if (userStore.state.token) {
        // 判断token是否存在
        reqConfig.headers.Authorization = userStore.state.token; // 将token设置成请求头
        reqConfig.headers.Token = userStore.state.token; // 将token设置成请求头
      }
      return reqConfig;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  const request: Request = async <T>(
    url: string,
    method: Method,
    data?: any,
    opt?: AxiosRequestConfig
  ): Result<T> => {
    opt = { error: true, loading: true, ...opt };
    const res = {} as ResponseResult<T>;
    const { confirm } = opt;
    if (confirm) {
      const { content, type } = confirm;
      const result = await new Promise((reslove) => {
        const onOk = () => reslove(true);
        const onCancel = () => reslove(false);
        if (type === 'delete') {
          BfrModal.deleteConfirm({
            content,
            onOk,
            onCancel
          });
        }
      });
      if (result === false) {
        res.ok = false;
        res.err = { message: 'confirm 取消', name: 'user' };
        return res;
      }
    }
    try {
      const response = await axiosInstance({
        url,
        method,
        data: method !== 'get' ? data : null,
        params: method === 'get' ? data : null,
        ...opt
      });
      const { data: resData } = response;
      if (resData.status === 'success') {
        const result = resData;
        if (opt?.success) {
          const { success } = opt;
          let message = '';
          let duration = MessageDuration;
          if (typeof success === 'string') {
            message = success;
          } else {
            message = success.message;
            duration = success.duration || MessageDuration;
          }
          Message.success(message, duration);
        }
        // 删除 status状态，方便后续的data处理
        delete result.status;
        const keys = Object.keys(result);
        // 如果data返回值有多个，则将数据至返回，如果只有一个，就直接拿取对应值，不留key，减少对象层次
        if (keys.length > 1) {
          res.data = result;
        } else if (keys.length === 1) {
          res.data = result[keys[0]];
        }
        res.ok = true;
      } else {
        res.ok = false;
        res.err = { message: resData.info, name: 'user' };
        const { error } = opt;
        const errorMsg = `${isProd ? '请稍后再试' : resData.info}`;
        if (resData.info === '无效的token' || resData.info === '请重新登录') {
          // defaultSource.cancel('token失效取消请求');
          // defaultSource = Axios.CancelToken.source();
          const { pathname } = history.location;
          history.replace(`/logout?redirect=${pathname}`);
        } else if (error) {
          if (error === true) {
            Message.error(`请求错误 ，${errorMsg}`);
          } else if (error instanceof Function) {
            error(res.err);
          } else {
            let message = '';
            let duration = MessageDuration;
            if (typeof error === 'string') {
              message = error;
            } else {
              message = error.message;
              duration = error.duration || MessageDuration;
            }
            Message.error(`${message} ，${errorMsg}`, duration);
          }
        }
      }
    } catch (err) {
      res.err = { message: err.message, name: 'system' };
      res.data = {} as T;
      res.ok = false;
      const { error } = opt;
      if (error === false || error === undefined) return res;
      if (error === true) {
        if (err.message === 'Network Error') {
          Message.error('网络错误 ，请稍后再试');
        } else if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
          Message.error('请求超时');
        } else if (err.response && typeof err.response.data === 'string') {
          Message.error(`${errorMessage[err.response.status]} ，请稍后再试`);
        }
      } else if (error instanceof Function) {
        error(res.err);
      } else {
        let message = '';
        let duration = MessageDuration;
        if (typeof error === 'string') {
          message = error;
        } else {
          message = error.message;
          duration = error.duration || MessageDuration;
        }
        Message.error(`${message} ，请稍后再试`, duration);
      }
    }
    return res;
  };

  request.get = <T>(url: string, data?: any, opt?: AxiosRequestConfig): Result<T> => {
    return request<T>(url, 'get', data, opt);
  };
  request.list = request.get;

  request.post = <T>(url: string, data?: any, opt?: AxiosRequestConfig): Result<T> => {
    return request<T>(url, 'post', data, opt);
  };
  request.put = <T>(url: string, data?: any, opt?: AxiosRequestConfig): Result<T> => {
    return request<T>(url, 'put', data, opt);
  };
  request.delete = <T>(url: string, data?: any, opt?: AxiosRequestConfig): Result<T> => {
    return request<T>(url, 'delete', data, opt);
  };
  request.patch = <T>(url: string, data?: any, opt?: AxiosRequestConfig): Result<T> => {
    return request<T>(url, 'patch', data, opt);
  };
  return request;
};

const requestV2 = createRequest({
  baseURL: apiUrl
});
const request_js = createRequest({
  baseURL: sysApiUrl
});

const requestStatic = Axios.create({});

export { requestV2, request_js, requestStatic };
