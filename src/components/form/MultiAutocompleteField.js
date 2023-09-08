import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

MultiAutocompleteField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.array,
  label: PropTypes.string.isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  isOptionEqualToValue: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  options: PropTypes.array.isRequired,
  limitTags: PropTypes.number,
  props: PropTypes.object,
};

export default function MultiAutocompleteField({
  name,
  control,
  defaultValue,
  label,
  getOptionLabel,
  isOptionEqualToValue,
  error,
  helperText,
  options,
  limitTags = 2,
  props,
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Autocomplete
          {...field}
          {...props}
          limitTags={limitTags}
          multiple
          fullWidth
          id={name}
          options={options}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          onChange={(_, selectedOptions) => field.onChange(selectedOptions)}
          renderInput={(params) => <TextField {...params} label={label} error={!!error} helperText={helperText} />}
        />
      )}
    />
  );
}
