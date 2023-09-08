import { PropTypes } from 'prop-types';
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

AutocompleteField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.any,
  label: PropTypes.string.isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  isOptionEqualToValue: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  options: PropTypes.array.isRequired,
  props: PropTypes.object,
};

export default function AutocompleteField({
  name,
  control,
  defaultValue,
  label,
  getOptionLabel,
  isOptionEqualToValue,
  error,
  helperText,
  options,
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Autocomplete
          {...field}
          fullWidth
          id={name}
          options={options}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          onChange={(_, selectedOptions) => field.onChange(selectedOptions)}
          renderInput={(params) => <TextField {...params} label={label} error={!!error} helperText={helperText} />}
          value={defaultValue}
        />
      )}
    />
  );
}
