import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

TextInputField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.any,
  label: PropTypes.string,
  error: PropTypes.bool.isRequired,
  helperText: PropTypes.string,
  inputType: PropTypes.string,
};

export default function TextInputField({
  name,
  control,
  defaultValue,
  label,
  error,
  helperText,
  inputType = 'text',
  ...props
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          {...field}
          {...props}
          fullWidth
          type={inputType}
          label={label}
          variant="outlined"
          error={!!error}
          helperText={helperText}
        />
      )}
    />
  );
}
