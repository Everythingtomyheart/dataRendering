import useCombineState from '@/hooks/useCombineState';
import { getuuid } from '@/utils';
import { useCallback } from 'react';

const localPointData = localStorage.getItem('userData') || '[]';

function localSave(name: string, data: any) {
  localStorage.setItem(name, JSON.stringify(data));
}
export default function useEditorModel() {
  const [state, setState] = useCombineState<{
    pointData: { id: string; item: any; point: any; isMenu?: any }[];
    curPoint: any;
  }>({
    pointData: JSON.parse(localPointData),
    curPoint: null
  });
  const addPointData = useCallback((payload: any) => {
    const pointData = [...state.pointData, payload];
    localSave('userData', pointData);
    setState({ pointData });
  }, []);
  const modPointData = useCallback((payload: any) => {
    const { id } = payload;
    const pointData = state.pointData.map((item: any) => {
      if (item.id === id) {
        return payload;
      }
      return { ...item };
    });
    localSave('userData', pointData);
    setState({ pointData });
  }, []);
  const importTplData = useCallback((pointData: any) => {
    localSave('userData', pointData);
    setState({ pointData });
  }, []);
  const copyPointData = useCallback((payload: any) => {
    const { id } = payload;
    const pointData: any[] = [];
    state.pointData.forEach((item: any) => {
      pointData.push({ ...item });
      if (item.id === id) {
        pointData.push({ ...item, id: getuuid() });
      }
    });
    localSave('userData', pointData);
    setState({ pointData });
  }, []);
  const delPointData = useCallback((payload: any) => {
    const { id } = payload;
    const pointData = state.pointData.filter((item: any) => item.id !== id);
    localSave('userData', pointData);
    setState({ pointData });
  }, []);
  const clearAll = useCallback(() => {
    localSave('userData', []);
    setState({ pointData: [] });
  }, []);
  return {
    state,
    addPointData,
    modPointData,
    importTplData,
    delPointData,
    copyPointData,
    clearAll
  };
}
