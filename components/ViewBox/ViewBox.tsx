import { Children, FC, ReactChildren, ReactNode, useContext, useEffect, useState } from 'react';

import { CanvasContext } from '../../context/CanvasContext';
import { ConfigContext } from '../../context/ConfigContext';
import { ViewBoxContext } from '../../context/ViewBoxContext';
import { nanoid } from 'nanoid';

type Props = {
  children: ReactNode | ReactChildren | FC | JSX.Element | null;
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  padding?: number;
  id?: string;
  paddingColor?: string;
}

const ViewBox = ({ x: originalX = 0, y: originalY = 0, padding = 0, width, children, id: originalId, paddingColor }: Props) => {

  const [id] = useState(originalId || nanoid());
  const viewBox = useContext(ViewBoxContext);
  const ctx = useContext(CanvasContext);
  const config = useContext(ConfigContext);

  const [childrenMap, setChildrenMap] = useState(new Map());
  const [height, setHeight] = useState(padding ? padding : 0); 
  const expectedChildren = Children.count(children)

  const x = viewBox?.constraintX ? viewBox.constraintX : originalX;
  const y = viewBox?.constraintY ? viewBox.constraintY : originalY;
  let w = width;

  if(!w) {
    w = viewBox?.availableWidth ? viewBox?.availableWidth : ctx.canvas.width;
  }


  const updateHeight = () => {
    let h = padding ? padding * 2 : 0;

    if(childrenMap.size) {
      for(const child of childrenMap.values()) {
        h = h + child.height
      }
    }

    if(height !== h) {
      setHeight(h);

      if(viewBox?.onHeightChanged) {
        viewBox?.onHeightChanged({ id, height: h });
      }
    }
  }

  ctx.clearRect(x, y, w, height);

  useEffect(() => {
    if(viewBox?.onNewChild) {
      viewBox?.onNewChild({ id, height });
    }
  }, []);

  useEffect(() => {
    if(config.debugPadding && padding && childrenMap.size === expectedChildren) {
      const halfPadding = padding / 2;
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = paddingColor ? paddingColor : 'red';
      ctx.lineWidth = padding;
      ctx.strokeRect(x + halfPadding, y + halfPadding, w - padding, height - padding );
      ctx.globalAlpha = 1;
    }
  })

  const onNewChild = ({ id: childId, height: childHeight }) => {
    if(!childrenMap.has(childId)) {
      setChildrenMap(new Map(childrenMap.set(childId, { id: childId, height: childHeight })));
      updateHeight();
    }
  };

  const onHeightChanged = ({ id: childId, height: childHeight}) => {

    if(childrenMap.has(childId) && childrenMap.get(childId).height === childHeight) {
      return;
    }
    
    setChildrenMap(new Map(childrenMap.set(childId, { id: childId, height: childHeight })));
    updateHeight();     
  }

  const viewBoxConstraints = {
    constraintX: x + padding,
    constraintY: y + padding,
    availableWidth: padding ? w - (padding * 2) : w,
    onNewChild,
    onHeightChanged,
  }

  return (
    <ViewBoxContext.Provider value={viewBoxConstraints}>
      {children}
    </ViewBoxContext.Provider>
  );
}

export default ViewBox;
