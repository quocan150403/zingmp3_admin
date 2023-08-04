import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button, Grid } from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// API
import { ageGroupApi } from '../../api';

// ----------------------------------------------------------------------
export default function GenreAddPage() {
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [minimum, setMinimum] = useState(0);
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setMinimum(0);
    setDescription('');
    setStatus(true);
  };

  const handleSubmit = async () => {
    console.log('submit');
    const data = {
      name,
      minimum,
      description,
      status: status ? 'active' : 'inactive',
    };

    try {
      await toast.promise(ageGroupApi.add(data), {
        pending: 'Thêm nhóm tuổi...',
        success: 'Thêm nhóm tuổi thành công!',
        error: 'Thêm nhóm tuổi thất bại!',
      });
      resetForm();
    } catch (error) {
      console.log(error);
    }
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
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Tuổi tối thiểu"
                  variant="outlined"
                  name="order"
                  type="number"
                  value={minimum}
                  onChange={(e) => setMinimum(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  variant="outlined"
                  name="order"
                  type="number"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      name="checked"
                      color="primary"
                    />
                  }
                  label="Trạng thái"
                />

                <Button onClick={handleSubmit} size="large" variant="contained" color="inherit">
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
