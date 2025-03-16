// src/components/common/CustomButton.jsx
import { Button } from '@mui/material';

const CustomButton = ({ 
  children, 
  color = 'primary', 
  variant = 'contained', 
  fullWidth = false, 
  size = 'medium',
  ...props 
}) => {
  return (
    <Button
      color={color}
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;