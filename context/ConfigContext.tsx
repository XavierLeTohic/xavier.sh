import { createContext } from 'react';

export const defaultConfig = {
  debugPadding: process.env.NEXT_PUBLIC_DEBUG_PADDING === 'true',
}

export const ConfigContext = createContext(defaultConfig)
