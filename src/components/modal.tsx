import type { ReactElement } from 'react';
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { ModalProps, ModalFuncProps } from 'antd';
import { Modal, Alert } from 'antd';
import type { DraggableEventHandler } from 'react-draggable';
import Draggable from 'react-draggable';
import { merge } from 'lodash-es';
import BasicLayout from '@/layouts/BasicLayout';

export interface BfrModalProps extends ModalProps {
  success?: (...arg: any) => void;
  close?: () => void;
  visible?: boolean;
}
export type ModalFC<T = Record<string, unknown>> = React.FC<T & BfrModalProps>;
/**
 * modal创建HOC，会根据传入的props等信息创建对应形式的modal
 * @param Component
 * @param options
 * @param config
 * @returns
 */
function WrapComponent(Component: ReactElement, options: any, config: any) {
  return React.cloneElement(Component, {
    keyboard: false,
    maskCloseable: false,
    ...options,
    ...config
  });
}
/**
 * function component模式下的modal创建hook，代理visible、close、render方法，并返回load、close方法进行调用
 *
 * const {load, close} = useModal(Component, anyProps);
 * @param Component 需要代理的modal组件订阅
 * @param options 需要预传入的props
 * @returns
 */
export function useModal<P extends BfrModalProps>(Component: React.FC<P>, options?: P) {
  const div = document.createElement('div');
  // 保存modal上一次的props，
  let oldConfig = {};
  // 自定义render方法
  const render = (config: BfrModalProps) => {
    console.log(config);
    // merge 旧config和新config，保证在render时，只修改出现变化的config，保证其他config的数据不变
    const realConfig = merge(oldConfig, config);
    ReactDOM.render(
      <BasicLayout>
        {WrapComponent(<Component {...(options as P)} />, { destroyOnClose: false }, realConfig)}
      </BasicLayout>,
      div
    );
  };
  const close = () => {
    render({ visible: false });
    let destory = true;
    // 判断关闭后是否销毁modal
    if (options) {
      destory = !(options.destroyOnClose === false);
    }
    destory &&
      setTimeout(() => {
        oldConfig = {};
        ReactDOM.unmountComponentAtNode(div);
      }, 500);
  };

  const load = (props?: Partial<P>) => {
    render({ ...props, visible: true, close });
  };
  return { close, load };
}
/**
 * 封装的modal组件，封装了拖动功能，其余功能与ant modal相同
 * @see https://ant.design/components/modal-cn/
 * @param props
 * @returns
 */
export const BfrModal: React.FC<ModalProps> & {
  deleteConfirm: (props: ModalFuncProps) => ReturnType<typeof Modal.confirm>;
} = (props) => {
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const [disabled, setDisabled] = useState(true);
  const draggleRef = useRef<HTMLDivElement>(null);

  const onStart: DraggableEventHandler = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    if (targetRect) {
      setBounds({
        left: uiData?.x - targetRect?.left,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: uiData?.y - targetRect?.top,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y)
      });
    }
  };
  return (
    <Modal
      keyboard={false}
      maskClosable={false}
      {...props}
      title={
        <div
          style={{ width: '100%', cursor: 'move' }}
          onMouseOver={() => setDisabled(false)}
          onMouseOut={() => setDisabled(true)}
        >
          {props.title || <Alert type='warning' message='请补充弹窗标题' />}
        </div>
      }
      modalRender={(modal) => {
        return (
          <Draggable onStart={onStart} bounds={bounds} disabled={disabled}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        );
      }}
    />
  );
};

BfrModal.deleteConfirm = ({
  content,
  okText = '确定',
  cancelText = '取消',
  ...config
}: ModalFuncProps) =>
  Modal.confirm({
    content,
    okText,
    cancelText,
    ...config
  });
