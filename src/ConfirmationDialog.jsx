function ConfirmationDialog({onConfirm, onCancel, confirmLabel}){

  return (<div className="confirmation-overlay">
    <div className="confirmation-box">
      <p>Are you sure you want to delete this game?</p>
      <div className="button-group">
        <button onClick={onConfirm} className="delete-button">{confirmLabel}</button>
        <button onClick={onCancel} className="cancel-button">Cancel</button>
      </div>
    </div>
  </div>)
}

export default ConfirmationDialog
