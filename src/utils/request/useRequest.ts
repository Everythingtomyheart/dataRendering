import type { BaseOptions, OptionsWithFormat, BaseResult } from '@ahooksjs/use-request/es/types';
import useAsync from '@ahooksjs/use-request/es/useAsync';
import type { ResponseResult } from '.';

type Service<R, P extends any[]> = (...args: P) => Promise<ResponseResult<R>> | Promise<R>;

function useRequest<R = any, P extends any[] = any, U = any, UU extends U = any>(
  service: Service<R, P>,
  options: OptionsWithFormat<R, P, U, UU>
): BaseResult<U, P>;
function useRequest<R = any, P extends any[] = any>(
  service: Service<R, P>,
  options?: BaseOptions<R, P>
): BaseResult<R, P>;
// @refresh reset
function useRequest(service: any, options?: any): any {
  if (typeof service !== 'function') throw new Error('service should be a function!');
  const promiseService = (...args: any[]) =>
    new Promise((resolve, reject) => {
      service(...args).then((data: any) => {
        if (data instanceof Array) {
          resolve(data);
        } else if (data.ok) {
          resolve(data.data);
        } else {
          reject(data.err);
        }
      });
    });
  return useAsync(promiseService, {
    throwOnError: true,
    ...options
  });
}
export default useRequest;
