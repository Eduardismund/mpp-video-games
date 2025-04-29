import {createContext, useContext, useState} from "react";

const ToastContext = createContext({});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({children}) => {
  const [toasts, setToasts] = useState([]);
  const [confirmations, setConfirmations] = useState([])

  const showToast = (message, type = "info") => {
    const id = `toast-${Date.now()}`
    setToasts((prev) => [...prev, {id, message, type}]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }

  const showConfirmation = ({message, onConfirm, onCancel, confirmLabel}) => {
    const id = `confirm-${Date.now()}`
    setConfirmations((prev) => [...prev, {id, message, onConfirm, onCancel, confirmLabel}]);
  }

  function onConfirm(confirmation) {
    confirmation.onConfirm && confirmation.onConfirm()
    setConfirmations(prev => prev.filter(item => item.id !== confirmation.id))
  }

  function onCancel(confirmation) {
    confirmation.onCancel && confirmation.onCancel()
    setConfirmations(prev => prev.filter(item => item.id !== confirmation.id))
  }

  return (
    <ToastContext.Provider value={{showToast, showConfirmation}}>
      {children}
      <div className="toasts-container">
        <div className="confirmation-overlay"
             style={{display: toasts.length > 0 || confirmations.length > 0 ? '' : 'none'}}>
          {toasts.map((toast) => (
            <div key={toast.id} className={`confirmation-box toast ${toast.type}`}>
              {toast.message}
            </div>
          ))}
          {confirmations.map((confirmation) => (
            <div key={confirmation.id} className="confirmation-box">
              <p>{confirmation.message}</p>
              <div className="button-group">
                <button onClick={e => onConfirm(confirmation, e)}
                        className="confirm-button">{confirmation.confirmLabel}</button>
                <button onClick={e => onCancel(confirmation, e)} className="cancel-button">Cancel</button>
              </div>
            </div>

          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};
