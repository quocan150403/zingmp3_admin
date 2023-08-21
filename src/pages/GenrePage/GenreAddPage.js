import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Card,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Container,
  Stack,
  Button,
  Grid,
  FormGroup,
} from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { genreApi } from '../../api';
import { ThumbnailPreview } from '../../components/image-preview';

// ----------------------------------------------------------------------
export default function GenreAddPage() {
  const [status, setStatus] = useState(true);
  const [isHome, setIsHome] = useState(false);
  const [name, setName] = useState('');
  const [row, setRow] = useState(0);
  const [image, setImage] = useState('');

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
    formData.append('name', name);
    formData.append('row', row);
    formData.append('isHome', isHome);
    formData.append('image', image);
    return formData;
  };

  const addData = async (formData) => {
    try {
      await toast.promise(genreApi.add(formData), {
        pending: 'Đang thêm thể loại...',
        success: 'Thêm thể loại thành công!',
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    }
  };

  const resetForm = () => {
    setName('');
    setRow(0);
    setImage('');
    setIsHome(false);
  };

  return (
    <>
      <Helmet>
        <title> Thêm Thể Loại | ZingMp3 </title>
      </Helmet>

      <Container>
        <ToastContainer />
        <Typography variant="h4" mb={5}>
          Thêm thể loại
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
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isHome}
                        onChange={(e) => setIsHome(e.target.checked)}
                        name="home"
                        color="primary"
                      />
                    }
                    label="Hiển thị ở trang chủ"
                  />
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
                </FormGroup>
              </Stack>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
                <Button onClick={handleFormSubmit} size="large" variant="contained" color="inherit">
                  Thêm thể loại
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
