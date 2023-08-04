import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Stack, TableBody, TableCell, TableRow, Typography } from '@mui/material';

import Iconify from '../iconify/Iconify';

// ----------------------------------------------------------------------
NotData.propTypes = {
  nameTable: PropTypes.string,
};

export default function NotData({ nameTable }) {
  const navigate = useNavigate();
  return (
    <TableBody>
      <TableRow>
        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
          <Stack direction="column" alignItems="center" spacing={1}>
            <Iconify icon={'eva:inbox-fill'} sx={{ width: 60, height: 60, color: 'text.disabled' }} />
            <Typography variant="h6" paragraph>
              Không có {nameTable} nào <Link to={'add'}>tạo mới</Link>
            </Typography>
          </Stack>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
