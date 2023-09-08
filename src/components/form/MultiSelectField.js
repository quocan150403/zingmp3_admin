import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';

function MultiSelectField({ name, control, defaultValue, label, error, helperText, options }) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select labelId={`${name}-label`} id={name} multiple {...field} input={<OutlinedInput label={label} />}>
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <div>{helperText}</div>}
        </FormControl>
      )}
    />
  );
}

export default MultiSelectField;
