import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button, Grid } from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// API
import { ageGroupApi } from '../../api';

// ----------------------------------------------------------------------
export default function AgeGroupEditPage() {
  const { id } = useParams();
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [minimum, setMinimum] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchAgeGroup = async () => {
      try {
        const res = await ageGroupApi.getById(id);
        console.log(res);
        const { name, minimum, description, status } = res;
        setName(name);
        setMinimum(minimum);
        setDescription(description);
        setStatus(status);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAgeGroup();
  }, [id]);

  const handleSubmit = async () => {
    const data = {
      name,
      minimum,
      description,
      status,
    };

    try {
      await toast.promise(ageGroupApi.edit(id, data), {
        pending: 'Cập nhật nhóm tuổi...',
        success: 'Cập nhật nhóm tuổi thành công!',
        error: 'Cập nhật nhóm tuổi thất bại!',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Cập nhật nhóm tuổi | BeeCine </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Cập nhật nhóm tuổi
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
                  Lưu
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
        <ToastContainer />
      </Container>
    </>
  );
}
