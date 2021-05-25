import type SocketIOClient from 'socket.io-client';
import io from 'socket.io-client';
import { getuuid } from '@/utils';
import { useEffect, useRef } from 'react';
import useMount from '@/hooks/useMount';

let socket: SocketIOClient.Socket;
// 初始化创建socket方法
function init() {
  try {
    socket = io('ws://localhost', {
      path: '/socket.io/',
      query: {
        userID: '123'
      },
      transports: ['websocket'],
      timeout: 50000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
// 获取socket实例
const getSocket = () => {
  if (!socket) {
    init();
  }
  return socket;
};
// 获取socket实例的自定义hook
const useSocket = () => {
  const client = useRef<SocketIOClient.Socket>();
  useMount(() => {
    client.current = getSocket();
  });
  return client.current;
};
// 全局的socket事件回调存储
const eventMaps = new Map<string, Map<string, (...args: any) => void>>();
/**
 * 监听socket事件的自定义hook
 * @param eventName 事件名称
 * @param fn 事件回调
 */
const useOnEvent = (eventName: string, fn: (...args: any) => void) => {
  // 持久化eventName
  const event = useRef(eventMaps.get(eventName));
  const isload = useRef(false);
  const uuid = useRef('');
  // 定义effect，在组件卸载后删除对应的socket回调
  useEffect(() => {
    return () => {
      eventMaps.get(eventName)?.delete(uuid.current);
    };
  }, [eventName, fn]);
  // 当前组件加载对应socket事件状态判断
  if (isload.current === false) {
    isload.current = true;
    // 初始化uuid ref
    uuid.current = getuuid();
    if (!event.current) {
      event.current = new Map();
    }
    event.current?.set(uuid.current, fn);
    eventMaps.set(eventName, event.current!);
    // 当event长度为1时，代表socket事件还未监听，使用on事件进行监听
    if (event.current?.size === 1) {
      const client = getSocket();
      if (client) {
        client.on(eventName, (...args: any) => {
          const events = eventMaps.get(eventName);
          events?.forEach((e) => {
            e(...args);
          });
        });
      }
    }
  }
};

export { init, getSocket, useOnEvent, useSocket };
