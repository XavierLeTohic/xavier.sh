import { ConfigContext, defaultConfig } from '../context/ConfigContext';
import { useEffect, useRef, useState } from 'react';

import Button from '../components/Button';
import { CanvasContext } from '../context/CanvasContext';
import Layer from '../components/Layer';

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
              <Layer padding={40} id="blue-wrapper" paddingColor="blue">
                <Layer padding={40} id="green-wrapper" paddingColor="green">
                  <Layer padding={40} id="buttons-wrapper">
                    <Button text="Click on me" fontSize={16} height={40} radius={6} id="first-button" />
                    <Button text="Click on me" fontSize={16} height={40} radius={6} id="first-button" />
                    <Button text="Click on me" fontSize={16} height={40} radius={6} id="first-button" />
                  </Layer>
                </Layer>
                {/* <Layer padding={40} id="second-wrapper" paddingColor="green">
                  <Layer padding={40}>
                    <Button text="Click on me" fontSize={16} height={40} radius={6}  />
                  </Layer>
                </Layer> */}
              </Layer>
            </>
          </CanvasContext.Provider>
        </ConfigContext.Provider>
      )}
    </>
  )
}

export default Homepage
