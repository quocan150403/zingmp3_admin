import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button, Grid } from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// components
import { genreApi } from '../../api';

// ----------------------------------------------------------------------
export default function GenreEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [isChildren, setIsChildren] = useState(false);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await genreApi.getById(id);
        console.log(res);
        const { name, isChildren, status } = res;
        setName(name);
        setIsChildren(isChildren);
        setStatus(status === 'active');
      } catch (error) {
        console.log(error);
      }
    };
    fetchGenre();
  }, [id]);

  const resetForm = () => {
    setName('');
    setIsChildren(false);
    setStatus(true);
  };

  const handleSubmit = async () => {
    const data = {
      name,
      isChildren,
      status: status ? 'active' : 'inactive',
    };
    const res = await toast.promise(
      genreApi.edit(id, data),
      {
        pending: 'Đang sửa thể loại...',
        success: 'Thành công! Chuyển hướng trong giây lát...',
        error: 'Sửa thể loại thất bại!',
      },
      {
        onClose: () => {
          navigate('/dashboard/genre');
        },
        autoClose: 2000,
      }
    );
    if (res?.status === 200) {
      resetForm();
    }
  };

  return (
    <>
      <Helmet>
        <title> Sửa Thể loại | BeeCine </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Sửa Thể loại
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
                  Lưu
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
