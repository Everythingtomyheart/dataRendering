import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

export interface calibrationTypes {
  width: number;
  height: number;
}
export type CalibrationTypes = {
  direction: 'up' | 'left' | 'right';
  multiple: number;
  id: string;
  left?: number;
  top?: number;
};
const CalibrationWrap = styled.div<{ left?: number; top?: number }>`
  position: relative;
  width: calc(100% + 50px);
  height: calc(100% + 50px);
  white-space: nowrap;
  transform: translate(${(props) => -(props.left ?? 0)}px, ${(props) => -(props.top ?? 0)}px);
  user-select: none;
  pointer-events: none;
  .calibrationNumber {
    color: #888;
    font-size: 12px;
  }
`;
export default function Calibration(props: CalibrationTypes) {
  const { direction, multiple, left, top } = props;
  const [calibrationLength, setCalibration] = useState<calibrationTypes>({ width: 0, height: 0 });
  const calibrationRef = useRef<HTMLDivElement>(null);

  const generateElement = useCallback(
    (item?: boolean, num?: number) => {
      if (calibrationRef.current) {
        const createSpan = document.createElement('div');
        createSpan.className = 'calibrationLine';
        createSpan.style.backgroundColor = '#ccc';
        calibrationRef.current.style.display = 'flex';
        calibrationRef.current.style.justifyContent = 'space-between';
        if (direction === 'up') {
          createSpan.style.width = '1px';
          createSpan.style.height = '6px';
          createSpan.style.display = 'inline-block';
        } else {
          calibrationRef.current.style.flexDirection = 'column';
          createSpan.style.height = '1px';
          createSpan.style.width = '6px';
        }
        if (item) {
          const createSpanContent = document.createElement('span');
          if (direction === 'up') {
            createSpan.style.height = '12px';
            createSpanContent.style.transform = 'translate3d(-4px, 20px, 0px)';
            createSpan.style.transform = 'translateY(0px)';
          } else {
            createSpan.style.width = '12px';
            createSpanContent.style.paddingLeft = '20px';
          }
          createSpanContent.style.display = 'block';
          createSpanContent.className = 'calibrationNumber';
          createSpanContent.innerHTML = `${num! * 5}`;
          createSpan.appendChild(createSpanContent);
        }
        calibrationRef.current.appendChild(createSpan);
      }
    },
    [direction]
  );

  useEffect(() => {
    if (calibrationRef.current) {
      const calibration = calibrationRef.current.getBoundingClientRect();
      setCalibration({ width: calibration.width, height: calibration.height });
      const length = direction === 'up' ? calibration.width : calibration.height;
      for (let i = 0; i < length / 5; i += 1) {
        if (i % 10 === 0) {
          generateElement(true, i);
        } else {
          generateElement();
        }
      }
    }
  }, [direction, generateElement]);

  useEffect(() => {
    if (calibrationRef.current) {
      const width = calibrationLength.width
        ? calibrationLength.width
        : calibrationRef.current.getBoundingClientRect().width;
      const height = calibrationLength.height
        ? calibrationLength.height
        : calibrationRef.current.getBoundingClientRect().height;
      const arr = [...Array.from(calibrationRef.current.querySelectorAll('.calibrationLine'))];
      if (arr.length) {
        if (direction === 'up') {
          calibrationRef.current.style.width = `${parseFloat(multiple.toFixed(1)) * width}px`;
          arr.forEach((el) => {
            const dom = [
              ...Array.from(el.querySelectorAll('.calibrationNumber'))
            ][0] as HTMLElement;
            if (dom) {
              dom.style.transform = `translate3d(-4px, 16px, 0px) scale(${(multiple + 0.1).toFixed(
                1
              )})`;
            }
          });
        } else {
          calibrationRef.current.style.height = `${parseFloat(multiple.toFixed(1)) * height}px`;
          arr.forEach((el) => {
            const dom = [
              ...Array.from(el.querySelectorAll('.calibrationNumber'))
            ][0] as HTMLElement;
            if (dom) {
              dom.style.transform = `translate3d(-4px, -8px, 0px) scale(${(multiple + 0.1).toFixed(
                1
              )})`;
            }
          });
        }
      }
    }
  }, [calibrationLength.height, calibrationLength.width, direction, multiple]);

  return <CalibrationWrap left={left} top={top} ref={calibrationRef}></CalibrationWrap>;
}
