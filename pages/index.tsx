import { ConfigContext, defaultConfig } from '../context/ConfigContext';
import { useEffect, useRef, useState } from 'react';

import Button from '../components/Button';
import { CanvasContext } from '../context/CanvasContext';
import ViewBox from '../components/ViewBox';

function Homepage() {
  const canvas = useRef(null);
  const [context, setContext] = useState(null)
  const [dimensions, setDimensions] = useState({ 
    height: 0,
    width: 0,
  })

  useEffect(() => {
    
    if(canvas.current) {
      canvas.current.width = window.innerWidth;
      canvas.current.height = window.innerHeight;
      const ctx = canvas.current.getContext('2d');
      setContext(ctx);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const [body] = entries;

      setDimensions({
        height: body.contentRect.height,
        width: body.contentRect.width,
      });

      canvas.current.height = body.contentRect.height;
      canvas.current.width = body.contentRect.width;
      setContext(canvas.current.getContext('2d'));
    });
    resizeObserver.observe(document.body);
  }, []);

  return (
    <>
      <canvas ref={canvas} />
      {context && (
        <ConfigContext.Provider value={defaultConfig}>
          <CanvasContext.Provider value={context}>
            <>
              <ViewBox padding={40} id="root-wrapper" paddingColor="blue">
                <ViewBox padding={40} id="middle-wrapper" paddingColor="green">
                  <ViewBox padding={40} id="button-wrapper">
                    <Button text="Click on me" fontSize={16} height={40} radius={6}  />
                  </ViewBox>
                </ViewBox>
              </ViewBox>
            </>
          </CanvasContext.Provider>
        </ConfigContext.Provider>
      )}
    </>
  )
}

export default Homepage
