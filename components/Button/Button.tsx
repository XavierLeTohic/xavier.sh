import { FC, useContext, useEffect, useState } from 'react'

import { CanvasContext } from '../../context/CanvasContext';
import { ViewBoxContext } from '../../context/ViewBoxContext';
import { nanoid } from 'nanoid';

type Props = {
  text: string;
  height: number;
  width?: number;
  radius?: number;
  x?: number;
  y?: number;
  fontSize?: number;
}

const Button : FC<Props> = ({ text, fontSize = 16, height : h, width, radius = 0, x: originalX = 0, y: originalY = 0 }) => {

  const ctx = useContext(CanvasContext);
  const viewBox = useContext(ViewBoxContext);
  const [id] = useState(nanoid());

  let w = width;

  if(!w) {
    w = viewBox?.availableWidth ? viewBox?.availableWidth : ctx.canvas.width;
  }

  const x = viewBox?.constraintX ? viewBox.constraintX + originalX : originalX;
  const y = viewBox?.constraintY ? viewBox.constraintY + originalY : originalY;

  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if(viewBox?.onNewChild) {
      viewBox?.onNewChild({ id, height: h })
    }
  }, []);

  const onHover = ({ clientX, clientY }) => {
    if(clientX > x && clientX < x + w && clientY > y && clientY < y + h) {
      ctx.canvas.style.cursor = 'pointer';
      setIsHover(true);
    } else if(isHover) {
      if(ctx.canvas.style.cursor === 'pointer') {
        ctx.canvas.style.cursor = 'default'
      }
      setIsHover(false);
    }
  }

  useEffect(() => {
    const r = x + w;
    const b = y + h;
    ctx.beginPath();
    if(isHover) {
      ctx.strokeStyle= "#AA624C"
    } else  {
      ctx.strokeStyle= "#f5845e"
    }
    ctx.lineWidth="1";
    ctx.moveTo(x + radius, y);
    ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    ctx.lineTo(r, y + h -radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();
    if(isHover) {
      ctx.fillStyle= "#AA624C"
    } else  {
      ctx.fillStyle= "#f5845e"
    }
    ctx.fill();
    ctx.font = `${fontSize}px Roboto`;
    ctx.fillStyle = "white";
    ctx.textAlign = 'center';
    ctx.fillText(text, x + (w / 2), y + (h / 1.6));

    ctx.canvas.addEventListener('mousemove', onHover);

    return () => {
      ctx.canvas.removeEventListener('mousemove', onHover);
    }
  });

  return null;
}

export default Button;
