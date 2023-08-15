import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button, Grid } from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { genreApi } from '../../api';
import { ThumbnailPreview } from '../../components/image-preview';

// ----------------------------------------------------------------------
export default function GenreEditPage() {
  const [status, setStatus] = useState(true);
  const [name, setName] = useState('');
  const [row, setRow] = useState(0);
  const [image, setImage] = useState('');
  const [oldImage, setOldImage] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await genreApi.getById(id);
        setName(res.name);
        setRow(res.row);
        setImage(res.imageUrl);
        setOldImage(res.imageUrl);
        setStatus(res.status);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const handleFormSubmit = async () => {
    try {
      const formData = createFormData();
      await updateData(formData);
      navigate('/dashboard/genre');
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('row', row);
    formData.append('image', image);
    formData.append('oldImage', oldImage);
    formData.append('status', status);
    return formData;
  };

  const updateData = async (formData) => {
    try {
      await toast.promise(genreApi.update(id, formData), {
        pending: 'Đang cập nhật thể loại...',
        success: 'Cập nhật thể loại thành công!',
        error: 'Cập nhật thể loại thất bại!',
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title> Cập Nhật Thể Loại | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Cập nhật thể loại
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={3} width="100%">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TextField
                    fullWidth
                    label="Tên thể loại"
                    variant="outlined"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Số hàng"
                    variant="outlined"
                    name="row"
                    type="number"
                    value={row}
                    onChange={(e) => setRow(e.target.value)}
                  />
                </Stack>
                <Stack>
                  <Typography variant="subtitle2" mb={2}>
                    Hình ảnh
                  </Typography>
                  <ThumbnailPreview image={image} setImage={setImage} />
                </Stack>
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

                <Button onClick={handleFormSubmit} size="large" variant="contained" color="inherit">
                  Lưu thể loại
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
