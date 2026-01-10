import { createContext, useState, useCallback, useRef } from "react";

export const NotificationContext = createContext({
  showNotification: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [payLoad, setPayLoad] = useState(null);
  const timeRef = useRef(null);

  const clearTimeOut = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current); 
      timeRef.current = null;
    }
  };

  const showNotification = useCallback(
    ({ title = "", message = "", type = "info", duration = 3000 }) => {
      setPayLoad({ title, message, type});
      clearTimeOut();
      timeRef.current = setTimeout(() => {
        setPayLoad(null);
        timeRef.current = null;
      }, duration); 
    },
    []
  );

  const hideNotification = useCallback(() => {
    clearTimeOut();
    setPayLoad(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ payLoad, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
