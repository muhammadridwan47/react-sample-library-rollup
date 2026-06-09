import React from 'react';

export interface MyButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const MyButton: React.FC<MyButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ padding: '8px 16px', cursor: 'pointer' }}
    >
      {label}
    </button>
  );
};