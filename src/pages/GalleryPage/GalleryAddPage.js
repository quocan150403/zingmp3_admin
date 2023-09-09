import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Typography, Container, Stack, Button, Grid } from '@mui/material';
// toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// form
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { CheckboxField, TextInputField, ThumbnailPreview } from '../../components/form';
import { galleryApi } from '../../api';

const schema = yup.object().shape({
  link: yup.string().required('Đường dẫn không được để trống'),
  order: yup.number().default(0).required('Thứ tự không được để trống'),
  status: yup.boolean().default(true),
  image: yup.mixed().test('fileType', 'Vui lòng tải lên một tệp hình ảnh', (value) => {
    if (!value) return false;
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(value.type);
  }),
});

// ----------------------------------------------------------------------
export default function GalleryAddPage() {
  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = createFormData(data);
      await addData(formData);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = (data) => {
    const formData = new FormData();
    formData.append('link', data.link);
    formData.append('order', data.order);
    formData.append('image', data.image);
    formData.append('status', data.status);
    return formData;
  };

  const addData = async (formData) => {
    try {
      await toast.promise(galleryApi.add(formData), {
        pending: 'Đang thêm banner...',
        success: 'Thêm banner thành công!',
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
        <title> Thêm Banner | ZingMp3 </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Thêm banner
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={3} width="100%">
                  <TextInputField
                    name="link"
                    inputType="text"
                    defaultValue=""
                    label="Nhập đường dẫn"
                    control={control}
                    error={!!errors.link}
                    helperText={errors.link?.message}
                  />
                  <TextInputField
                    name="order"
                    inputType="number"
                    label="Nhập thứ tự"
                    defaultValue={0}
                    control={control}
                    error={!!errors.order}
                    helperText={errors.order?.message}
                  />
                  <Stack>
                    <Typography variant="subtitle2" mb={2}>
                      Hình ảnh
                    </Typography>
                    <ThumbnailPreview
                      name="image"
                      form={{ watch, setValue }}
                      error={!!errors.image}
                      helperText={errors.image?.message}
                    />
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                  <CheckboxField name="status" label="Trạng thái" control={control} />
                  <Button type="submit" size="large" variant="contained" color="inherit">
                    Thêm Banner
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
