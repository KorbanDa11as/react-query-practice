import Modal from "./Modal";

export default function Confirm({ confirmationMsg, onConfirm, onCancel }) {
  return (
    <Modal>
      <h2>{confirmationMsg}</h2>
      <div className="form-actions">
        <button onClick={onCancel} className="button-text">
          Cancel
        </button>
        <button onClick={onConfirm} type="submit" className="button">
          Confirm
        </button>
      </div>
    </Modal>
  );
}
