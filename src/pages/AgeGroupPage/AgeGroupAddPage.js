import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button, Grid } from '@mui/material';

// ----------------------------------------------------------------------
export default function GenreAddPage() {
  const [checked, setChecked] = useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Helmet>
        <title> Thêm Nhóm tuổi | BeeCine </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Thêm Nhóm tuổi
        </Typography>

        <Grid container>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2} mb={3} width="100%">
                <TextField
                  fullWidth
                  label="Tên nhóm tuổi"
                  variant="outlined"
                  name="name"
                  // value={name}
                  // onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Tuổi tối thiểu"
                  variant="outlined"
                  name="order"
                  type="number"
                  // value={name}
                  // onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  variant="outlined"
                  name="order"
                  type="number"
                  multiline
                  rows={4}
                  // value={name}
                  // onChange={handleChange}
                />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <FormControlLabel
                  control={<Switch checked={checked} onChange={handleChange} name="checked" color="primary" />}
                  label="Trạng thái"
                />

                <Button size="large" variant="contained" color="inherit">
                  Thêm nhóm tuổi
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
