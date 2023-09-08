import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Switch, FormControlLabel } from '@mui/material';

CheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
};

export default function CheckboxField({ name, control, label, defaultValue = true }) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormControlLabel control={<Switch {...field} checked={field.value} color="primary" />} label={label} />
      )}
    />
  );
}
