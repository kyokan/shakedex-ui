import React, {ReactNode} from 'react';
import ReactDOM from 'react-dom';
import './modal.scss';

const modalRoot: HTMLDivElement = document.querySelector('#modal-root') as HTMLDivElement;

type Props = {
  className?: string;
  children: ReactNode;
  onClose: () => void;
}

function Modal(props: Props) {
  const { className, onClose, children } = props;

  return ReactDOM.createPortal(
    <div
      className="modal__overlay"
      onClick={e => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className={`modal__wrapper ${className}`} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}

export default Modal;

export function ModalHeader(props: {
  children: ReactNode;
}) {
  return (
    <div className="modal__header">
      {props.children}
    </div>
  )
}

export function ModalContent(props: {
  children: ReactNode;
}) {
  return (
    <div className="modal__content">
      {props.children}
    </div>
  )
}
