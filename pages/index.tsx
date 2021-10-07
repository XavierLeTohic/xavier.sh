import { ConfigContext, defaultConfig } from '../context/ConfigContext';
import { useEffect, useRef, useState } from 'react';

// import Header from '../components/Header';
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
    const handleResize = () => {

      if(dimensions.height !== window.innerHeight || dimensions.width !== window.innerWidth) {  
        setDimensions({
          height: window.innerHeight,
          width: window.innerWidth
        });

        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;
        setContext(canvas.current.getContext('2d'));
      }
    }

    handleResize();
    
    if(canvas.current) {
      canvas.current.width = window.innerWidth;
      canvas.current.height = window.innerHeight;
      const ctx = canvas.current.getContext('2d');
      setContext(ctx);
    }

    window.addEventListener('resize', handleResize)
  }, []);

  return (
    <>
      <canvas ref={canvas} />
      {context && (
        <ConfigContext.Provider value={defaultConfig}>
          <CanvasContext.Provider value={context}>
            <>
              <ViewBox padding={40}>
                <ViewBox padding={40}>
                  <Button text="Click on me" fontSize={16} height={40} radius={6}  />
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
