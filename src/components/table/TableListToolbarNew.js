import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Tabs, Tab, Stack, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component

import Iconify from '../iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
}));

const StyleTabs = styled('div')(({ theme }) => ({
  width: '100%',
  boxShadow: 'rgba(145, 158, 171, 0.08) 0px -2px 0px 0px inset',
  '& .MuiTabs-flexContainer': {
    margin: '0 20px',
  },
  '& .MuiTab-root': {
    // padding: 0,
  },
  '& .MuiTabs-indicator': {
    // backgroundColor: theme.palette.text.primary,
    height: 2.5,
    borderRadius: '4px 4px 0 0',
  },
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

TableListToolbarNew.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  placeholder: PropTypes.string,
  onFilterName: PropTypes.func,
};

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
];

export default function TableListToolbarNew({ numSelected, filterName, onFilterName, placeholder, onDeleteAll }) {
  const [value, setValue] = useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <StyleTabs>
        <Tabs sx={{ height: '48px' }} textColor="secondary" value={value} onChange={handleChange}>
          <Tab value="one" label="Tất cả" icon={<Iconify icon="eva:home-fill" />} iconPosition="start" />
          <Tab value="two" label="Phim lẻ" icon={<Iconify icon="eva:film-fill" />} iconPosition="start" />
          <Tab value="three" label="Phim bộ" icon={<Iconify icon="eva:film-outline" />} iconPosition="start" />
        </Tabs>
      </StyleTabs>
      <Stack p="20px" width="100%" direction="row" justifyContent="space-between">
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} Đã chọn
          </Typography>
        ) : (
          <Stack>
            {/* <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={top100Films}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <CheckBox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  {option.title}
                </li>
              )}
              style={{ width: 500 }}
              renderInput={(params) => <TextField {...params} label="Checkboxes" placeholder="Favorites" />}
            /> */}
            <StyledSearch
              value={filterName}
              onChange={onFilterName}
              placeholder={placeholder}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              }
            />
          </Stack>
        )}

        {numSelected > 0 ? (
          <Tooltip onClick={onDeleteAll} title="Delete">
            <IconButton>
              <Iconify icon="eva:trash-2-fill" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </StyledRoot>
  );
}
