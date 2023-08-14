import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Stack, Tabs, Tab } from '@mui/material';
// component
import Iconify from '../iconify';
import Label from '../label';
// import TableFilter from './TableFilter';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(() => ({
  height: '144px',
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  padding: 0,
}));

const StyleTabs = styled('div')(({ theme }) => ({
  width: '100%',
  boxShadow: 'rgba(145, 158, 171, 0.08) 0px -2px 0px 0px inset',
  borderRadius: theme.shape.borderRadius,

  '& .MuiTabs-flexContainer': {
    margin: '0 20px',
  },

  '& .MuiTab-root': {
    minHeight: 48,
    padding: '0 12px',
    marginRight: '16px',
    color: theme.palette.text.secondary,
    textTransform: 'capitalize',
    '&.Mui-selected': {
      color: theme.palette.text.primary,
    },
  },

  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.text.primary,
    height: 2.5,
    borderRadius: '4px 4px 0 0',
  },
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: '100%',
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

const StyleOverplay = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  width: '100%',
  height: '100%',
  color: theme.palette.primary.main,
  padding: '20px',
  backgroundColor: theme.palette.primary.lighter,
}));

// ----------------------------------------------------------------------

TableListToolbar.propTypes = {
  tabs: PropTypes.array,
  status: PropTypes.number,
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  placeholder: PropTypes.string,
  onFilterName: PropTypes.func,
  onDeleteAll: PropTypes.func,
  onForceDeleteAll: PropTypes.func,
  onChangeStatus: PropTypes.func,
};

export default function TableListToolbar({
  tabs,
  status,
  numSelected,
  filterName,
  onFilterName,
  placeholder,
  onDeleteAll,
  onForceDeleteAll,
  onChangeStatus,
}) {
  return (
    <StyledRoot>
      {numSelected > 0 ? (
        <StyleOverplay>
          <Stack height="100%" width="100%" direction="row" alignItems="center" justifyContent="space-between">
            <Typography component="div" variant="subtitle1">
              {numSelected} Đã chọn
            </Typography>
            <Tooltip title="Delete">
              <IconButton onClick={status === 4 ? onForceDeleteAll : onDeleteAll}>
                <Iconify icon="eva:trash-2-fill" />
              </IconButton>
            </Tooltip>
          </Stack>
        </StyleOverplay>
      ) : (
        <Stack width="100%">
          <StyleTabs>
            <Tabs textColor="secondary" value={status} onChange={onChangeStatus}>
              {tabs.map((item, index) => (
                <Tab key={index} {...item} icon={<Label color={item.color}>{item.number}</Label>} />
              ))}
            </Tabs>
          </StyleTabs>
          <Stack
            spacing={1.5}
            sx={{ padding: '20px' }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
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
        </Stack>
      )}
    </StyledRoot>
  );
}
