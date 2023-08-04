import { MenuItem, Popover } from '@mui/material';
import Iconify from '../iconify/Iconify';

export default function PopoverMenu({ open, onClose, onOpenModalDelete, onEditRow }) {
  return (
    <Popover
      open={Boolean(open)}
      anchorEl={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          p: 1,
          width: 140,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        },
      }}
    >
      <MenuItem onClick={onEditRow}>
        <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
        Sửa
      </MenuItem>

      <MenuItem onClick={onOpenModalDelete} sx={{ color: 'error.main' }}>
        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
        Xóa
      </MenuItem>
    </Popover>
  );
}
