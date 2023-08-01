import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button, Grid } from '@mui/material';
import Avatar from '../../components/avatar';

// ----------------------------------------------------------------------
export default function ArtistAddPage() {
  const [checked, setChecked] = useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Helmet>
        <title> Thêm Quốc Gia | BeeCine </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Thêm Quốc Gia
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 4, pt: 10 }}>
              <Avatar />
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <TextField fullWidth label="Tên quốc gia" variant="outlined" name="name" />
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mt={3} mb={3}>
                <TextField fullWidth label="Code" variant="outlined" name="code" />
                <TextField fullWidth label="Ngôn ngữ" variant="outlined" name="language" />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
                <TextField fullWidth label="Đầu số điện thoại" variant="outlined" name="phone" />
                <TextField fullWidth label="Đơn vị tiền tệ" variant="outlined" name="currency" />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <FormControlLabel
                  control={<Switch checked={checked} onChange={handleChange} name="checked" color="primary" />}
                  label="Trạng thái"
                />

                <Button size="large" variant="contained" color="inherit">
                  Thêm quốc gia
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
