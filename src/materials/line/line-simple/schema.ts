import type {
  ITextConfigType,
  INumberConfigType,
  TNumberDefaultType
} from '@/components/FormComponents/types';

export type TLineSimpleEditData = (INumberConfigType | ITextConfigType)[];
export interface ILineSimpleConfig {
  height: TNumberDefaultType;
  width: TNumberDefaultType;
}

const LineSimple: ILineSimpleConfig = {
  height: 400,
  width: 400
};

export default LineSimple;
