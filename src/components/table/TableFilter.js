// src/components/TableFilter.js

import { useState } from 'react';

// @mui
import { Menu, Button, MenuItem, Tooltip } from '@mui/material';

// component
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Nổi bật' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
];

export default function TableFilter() {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Lọc">
        <Button
          id="table-filter"
          aria-controls={open ? 'table-filter' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          color="inherit"
          disableRipple
        >
          <Iconify icon={'eva:more-vertical-fill'} />
        </Button>
      </Tooltip>

      <Menu
        id="table-filter"
        keepMounted
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem key={option.value} selected={option.value === 'featured'} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
