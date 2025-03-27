import {createContext, useContext, useState} from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({children}) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, {id, message, type}]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000); // Auto-close after 3 seconds
  };

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <div className="toasts-container">
        {toasts.map((toast) => (
          <div key={toast.id}
               className="confirmation-overlay">
            <div className={`confirmation-box toast ${toast.type}`}>
              {toast.message}
            </div>
          </div>
          ))}
      </div>

    </ToastContext.Provider>
  );
};
