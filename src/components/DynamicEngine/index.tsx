import type { FC } from 'react';
// import { dynamic } from 'umi';
import { dynamic } from 'umi';
import { useMemo, memo } from 'react';
import { Spin } from 'antd';

const DynamicFunc = (type: string, componentsType: string) => {
  return dynamic({
    async loader() {
      const { default: Graph } = await import(`@/materials/${componentsType}/${type}`);
      const Component = Graph;
      return (props: DynamicType) => {
        const { config, isTpl } = props;
        return <Component {...config} isTpl={isTpl} />;
      };
    },
    loading: () => (
      <div style={{ paddingTop: 10, textAlign: 'center' }}>
        <Spin />
      </div>
    )
  });
};

type DynamicType = {
  isTpl: boolean;
  config: Record<string, any>;
  type: string;
  componentsType: string;
  category: string;
};
const DynamicEngine = memo((props: DynamicType) => {
  const { type, config, category } = props;
  const Dynamic = useMemo(() => {
    return DynamicFunc(type, category) as unknown as FC<DynamicType>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return <Dynamic {...props} />;
});

export default DynamicEngine;
