import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button } from '@mui/material';

// ----------------------------------------------------------------------
export default function GenreAddPage() {
  const [checked, setChecked] = useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Helmet>
        <title> Thêm Thể loại | BeeCine </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Thêm Thể loại
        </Typography>

        <Card sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3} mb={3}>
            <Stack spacing={2} width="100%">
              <Typography variant="subtitle1">Tên thể loại</Typography>
              <TextField
                fullWidth
                label="Tên thể loại"
                variant="outlined"
                name="name"
                // value={name}
                // onChange={handleChange}
              />
            </Stack>
            <Stack spacing={2} width="100%">
              <Typography variant="subtitle1">Thứ tự</Typography>
              <TextField
                fullWidth
                label="Thứ tự"
                variant="outlined"
                name="order"
                type="number"
                // value={name}
                // onChange={handleChange}
              />
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
            <FormControlLabel
              control={<Switch checked={checked} onChange={handleChange} name="checked" color="primary" />}
              label="Trạng thái"
            />

            <Button size="large" variant="contained" color="inherit">
              Thêm thể loại mới
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
}
