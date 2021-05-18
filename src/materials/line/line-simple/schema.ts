import type {
  ITextConfigType,
  INumberConfigType,
  TNumberDefaultType
} from '@/components/FormComponents/types';

export type TLineSimpleEditData = (INumberConfigType | ITextConfigType)[];
export interface ILineSimpleConfig {
  height: TNumberDefaultType;
}

const LineSimple: ILineSimpleConfig = {
  height: 32
};

export default LineSimple;
