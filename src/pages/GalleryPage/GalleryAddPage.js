import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Card, Typography, TextField, FormControlLabel, Switch, Container, Stack, Button, Grid } from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { galleryApi } from '../../api';
import { ThumbnailPreview } from '../../components/image-preview';

// ----------------------------------------------------------------------
export default function GalleryAddPage() {
  const [status, setStatus] = useState(true);
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const handleFormSubmit = async () => {
    try {
      const formData = createFormData();
      await addData(formData);
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('link', link);
    formData.append('order', order);
    formData.append('imageUrl', imageUrl);
    formData.append('status', status);
    return formData;
  };

  const addData = async (formData) => {
    await toast.promise(galleryApi.add(formData), {
      pending: 'Đang thêm banner...',
      success: 'Thêm banner thành công!',
      error: 'Thêm banner thất bại!',
    });
  };

  const resetForm = () => {
    setLink('');
    setOrder(0);
    setImageUrl('');
  };

  return (
    <>
      <Helmet>
        <title> Thêm Banner | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Thêm banner
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={3} width="100%">
                <TextField
                  fullWidth
                  label="Đường dẫn"
                  variant="outlined"
                  name="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Thứ tự"
                  variant="outlined"
                  name="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
                <Stack>
                  <Typography variant="subtitle2" mb={2}>
                    Hình ảnh
                  </Typography>
                  <ThumbnailPreview image={imageUrl} setImage={setImageUrl} />
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
                  Thêm Banner
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
