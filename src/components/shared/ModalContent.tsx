import React from 'react';

interface ModalContentProps {
  children: React.ReactNode;
}

const ModalContent: React.FC<ModalContentProps> = ({ children }) => {
  return (
    <div className="modal-content">
      {children}
    </div>
  );
};

export default ModalContent;
