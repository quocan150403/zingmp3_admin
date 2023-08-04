import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button, Grid } from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// components
import { genreApi } from '../../api';

// ----------------------------------------------------------------------
export default function GenreAddPage() {
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [isChildren, setIsChildren] = useState(false);

  const resetForm = () => {
    setName('');
    setIsChildren(false);
    setStatus(true);
  };

  const handleSubmit = async () => {
    const data = {
      name,
      isChildren,
      status,
    };
    try {
      await toast.promise(genreApi.add(data), {
        pending: 'Thêm thể loại...',
        success: 'Thêm thể loại thành công!',
        error: 'Thêm thể loại thất bại!',
      });
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Thêm Thể loại | BeeCine </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Thêm Thể loại
        </Typography>

        <Grid container>
          <Grid item xl={6}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3} mb={3}>
                <Stack spacing={3} width="100%">
                  <TextField
                    fullWidth
                    label="Tên thể loại"
                    variant="outlined"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <FormControlLabel
                    control={
                      <Switch checked={isChildren} onChange={(e) => setIsChildren(e.target.checked)} color="primary" />
                    }
                    label="Là thể loại dành cho trẻ em"
                  />
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <FormControlLabel
                  control={<Switch checked={status} onChange={(e) => setStatus(e.target.checked)} color="primary" />}
                  label="Trạng thái"
                />

                <Button onClick={handleSubmit} size="large" variant="contained" color="inherit">
                  Thêm thể loại mới
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
