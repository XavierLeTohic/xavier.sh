import {
  Children,
  FC,
  ReactChildren,
  ReactNode,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useState,
} from 'react'

import { CanvasContext } from '../../context/CanvasContext'
import { ConfigContext } from '../../context/ConfigContext'
import { ViewBoxContext } from '../../context/ViewBoxContext'
import { nanoid } from 'nanoid'

type Props = {
  children: ReactNode | ReactChildren | FC | JSX.Element | null
  x?: number
  y?: number
  height?: number
  width?: number
  padding?: number
  id?: string
  paddingColor?: string
}

const Layer = ({
  x: originalX = 0,
  y: originalY = 0,
  padding = 0,
  width,
  children,
  id: originalId,
  paddingColor,
}: Props) => {
  const [id] = useState(originalId || nanoid())
  const parentViewBox = useContext(ViewBoxContext)
  const ctx = useContext(CanvasContext)
  const config = useContext(ConfigContext)

  const [childrenMap, setChildrenMap] = useState(new Map())
  const [height, setHeight] = useState(padding ? padding : 0)
  const expectedChildren = Children.count(children)
 
  const x = parentViewBox?.constraintX || originalX
  const y = parentViewBox?.constraintY || originalY;
  let w = width

  if (!w) {
    w = parentViewBox?.availableWidth
      ? parentViewBox?.availableWidth
      : (ctx.canvas.width - originalX)
  }

  const updateHeight = () => {
    let h = padding ? padding * 2 : 0

    if (childrenMap.size) {
      for (const child of childrenMap.values()) {
        h = h + child.height
      }
    }

    if (height !== h) {
      setHeight(h)

      if (parentViewBox?.onHeightChanged) {
        parentViewBox?.onHeightChanged({ id, height: h, x, y, padding })
      }
    }
  }

  ctx.clearRect(x, y, w, height)

  useEffect(() => {
    if (parentViewBox?.onNewChild) {
      parentViewBox?.onNewChild({ id, height, x, y, padding })
    }
  }, [])

  useEffect(() => {
    if (
      config.debugPadding &&
      padding &&
      childrenMap.size === expectedChildren
    ) {
      const halfPadding = padding / 2
      ctx.globalAlpha = 0.2
      ctx.strokeStyle = paddingColor ? paddingColor : 'red'
      ctx.lineWidth = padding
      ctx.strokeRect(
        x + halfPadding,
        y + halfPadding,
        w - padding,
        height - padding
      )
      ctx.globalAlpha = 1
    }
  })

  const onNewChild = ({
    id: childId,
    height: childHeight,
    ...childProps
  }) => {
    if (!childrenMap.has(childId)) {
      setChildrenMap(
        new Map(
          childrenMap.set(childId, {
            id: childId,
            height: childHeight,
            isFirstChild: childrenMap.size === 0,
            ...childProps
          })
        )
      )
      updateHeight()
    }
  }

  const onHeightChanged = ({
    id: childId,
    height: childHeight,
    ...childProps
  }) => {

    setChildrenMap(
      new Map(
        childrenMap.set(childId, {
          id: childId,
          height: childHeight,
          isFirstChild: childrenMap.size === 0,
          ...childProps
        })
      )
    )
    updateHeight()
  }

  const viewBoxConstraints = {
    constraintX: x + padding,
    constraintY: y + padding,
    x,
    y,
    height,
    availableWidth: padding ? w - padding * 2 : w,
    onNewChild,
    onHeightChanged,
  }

  return (
    <ViewBoxContext.Provider value={viewBoxConstraints}>
      {Children.map(children, (child : any, index) => {

        if(!isValidElement(child)) {
          return child;
        }

        let childY;

        if(index > 1 && (child?.props as any)?.height) {
          childY = x 
        }

        console.log(id, child);
        return cloneElement(child, {
        })
      })}
    </ViewBoxContext.Provider>
  )
}

export default Layer
