import * as React from 'react';

export function useIsMac() {
  const [isMac, setIsMac] = React.useState(true);

  React.useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'));
  }, []);

  return isMac;
}
