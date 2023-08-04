import { TableBody, TableCell, TableRow, Paper, Typography } from '@mui/material';

export default function NoSearchData({ nameSearch }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
          <Paper
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" paragraph>
              Không tìm thấy thể loại
            </Typography>

            <Typography variant="body2">
              Không có kết quả nào cho
              <strong>&quot;{nameSearch}&quot;</strong>.
              <br /> Thử kiểm tra lỗi chính tả hoặc sử dụng từ khóa chung hơn.
            </Typography>
          </Paper>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
