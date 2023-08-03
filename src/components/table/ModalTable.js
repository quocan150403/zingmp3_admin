import { Box, Stack, Typography, Button, Modal } from '@mui/material';

import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: '#fff',
  borderRadius: '16px',
  boxShadow: 'rgba(0, 0, 0, 0.24) -40px 40px 80px -8px',
  p: 3,
};

ModalTable.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default function ModalTable({ title, content, open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" variant="body2" sx={{ mt: 2 }}>
          {content}
        </Typography>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" color="error" onClick={onConfirm} sx={{ ml: 2 }}>
            Xác nhận
          </Button>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Hủy
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
