// import type { PromiseFn } from 'typings';

import type { PromiseFn } from '@/@types/type';

export const getParameter = (parameterName: string) => {
  let result: string = '';
  let tmp = [];
  window.location.search
    .substr(1)
    .split('&')
    .forEach((item) => {
      tmp = item.split('=');
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });

  return result || '';
};

export const getParameters = () => {
  const result: Record<string, string> = {};
  window.location.search
    .substr(1)
    .split('&')
    .forEach((item) => {
      const [key, value] = item.split('=');
      result[key] = value;
    });

  return result;
};

export function getuuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string): string => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 文件下载
 * @param url 文件下载地址
 */
export function fileDownload(url: string, filename?: string): void {
  if (url === '') throw new Error('下载地址为空');
  const a = document.createElement('a');
  const realFileName = filename ?? url.split('/').pop();
  const event = new MouseEvent('click');
  a.download = realFileName ?? 'download';
  a.target = 'none';
  a.href = url;
  a.dispatchEvent(event);
}
export function imageDownload(url: string, filename?: string): void {
  if (url === '') throw new Error('下载地址为空');
  const image = new Image();
  image.src = `${url}?v=${new Date()}`;
  image.crossOrigin = '*';
  const realFileName = filename ?? url.split('/').pop();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(image, 0, 0, image.width, image.height);
    const blobUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    const event = new MouseEvent('click');
    a.download = realFileName ?? 'download.png';
    a.target = '_blank';
    a.href = blobUrl;
    a.dispatchEvent(event);
    URL.revokeObjectURL(blobUrl);
  };
}

export function download(
  url: string,
  option: { filename?: string; image?: boolean } = { image: false }
): void {
  if (option.image) {
    imageDownload(url, option.filename);
  } else {
    fileDownload(url, option.filename);
  }
}
/**
 * 代理asyncawait写法的promise，为方法加上trycatch，并转化为固定对象返回，简化编写逻辑
 *
 * 使用方法 const {data,ok,err } = await asyncFunction(fn,param1,param2)
 * @param fn 需要被代理的promise方法
 * @param params fn的熟悉
 * @returns
 */

export async function asyncFunction<T>(
  fn: PromiseFn<T>,
  ...params: Parameters<typeof fn>
): Promise<{ ok: boolean; err?: any; data?: T }> {
  const res = { ok: false, data: undefined, err: undefined };
  try {
    res.data = (await fn(...(params as any[]))) as any;
    res.ok = true;
  } catch (error) {
    res.ok = false;
    res.err = error;
  }
  return res;
}
