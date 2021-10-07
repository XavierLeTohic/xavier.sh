import { Children, FC, ReactChildren, ReactNode, useContext, useEffect, useState } from 'react'

import { CanvasContext } from '../../context/CanvasContext';
import { ConfigContext } from '../../context/ConfigContext';
import { ViewBoxContext } from '../../context/ViewBoxContext';

type Props = {
  children: ReactNode | ReactChildren | FC | JSX.Element | null;
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  padding?: number;
}

const ViewBox = ({ x: originalX = 0, y: originalY = 0, padding = 0, width, children }: Props) => {

  const viewBox = useContext(ViewBoxContext);
  const ctx = useContext(CanvasContext);
  const config = useContext(ConfigContext);

  const [childrenMap, setChildrenMap] = useState(new Map());
  const expectedChildren = Children.count(children)

  const x = viewBox?.constraintX ? viewBox.constraintX : originalX;
  const y = viewBox?.constraintY ? viewBox.constraintY : originalY;
  let h = padding ? padding : 0;
  let w = width;

  if(!w) {
    w = viewBox?.availableWidth ? viewBox?.availableWidth : ctx.canvas.width;
  }

  if(childrenMap.size) {
    for(const child of childrenMap.values()) {
      h = h + child.height
    }
  }

  ctx.clearRect(x, y, w, h);

  useEffect(() => {
    if(config.debugPadding && padding && childrenMap.size === expectedChildren) {
      const halfPadding = padding / 2;
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = 'red';
      ctx.lineWidth = padding;
      ctx.strokeRect(x + halfPadding, y + halfPadding, w - padding, h );
      ctx.globalAlpha = 1;
    }
  })

  const onNewChild = ({ id, height: childHeight }) => {
    if(!childrenMap.has(id)) {
      setChildrenMap(new Map(childrenMap.set(id, { id, height: childHeight })));
    }
  };

  const viewBoxConstraints = {
    constraintX: x + padding,
    constraintY: y + padding,
    availableWidth: padding ? w - (padding * 2) : w,
    onNewChild,
  }

  return (
    <ViewBoxContext.Provider value={viewBoxConstraints}>
      {children}
    </ViewBoxContext.Provider>
  );
}

export default ViewBox;
