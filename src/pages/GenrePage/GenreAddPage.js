import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Typography, Container, Stack, Button, Grid, FormGroup } from '@mui/material';
// toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// comp
import { TextInputField, CheckboxField, ThumbnailPreview } from '../../components/form';
import { genreApi } from '../../api';

const schema = yup.object().shape({
  name: yup.string().required('Tên thể loại không được để trống'),
  row: yup.number().required('Số thứ tự của hàng không được để trống'),
  isHome: yup.boolean(),
  status: yup.boolean(),
  image: yup.mixed().test('fileType', 'Vui lòng tải lên một tệp hình ảnh', (value) => {
    if (!value) return false;
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(value.type);
  }),
});
// ----------------------------------------------------------------------
export default function GenreAddPage() {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    reset,
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
    formData.append('name', data.name);
    formData.append('row', data.row);
    formData.append('isHome', data.isHome);
    formData.append('image', data.image);
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

  return (
    <>
      <Helmet>
        <title> Thêm Thể Loại | ZingMp3 </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Thêm thể loại
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={3} width="100%">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TextInputField
                      name="name"
                      inputType="text"
                      label="Tên thể loại"
                      defaultValue=""
                      control={control}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                    <TextInputField
                      name="row"
                      inputType="number"
                      defaultValue={0}
                      label="Số hàng"
                      control={control}
                      error={!!errors.row}
                      helperText={errors.row?.message}
                    />
                  </Stack>

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
                  <FormGroup>
                    <CheckboxField
                      name="isHome"
                      label="Hiển thị thể loại ở trang chủ"
                      defaultValue={false}
                      control={control}
                    />
                    <CheckboxField name="status" label="Trạng thái" control={control} />
                  </FormGroup>
                </Stack>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
                  <Button type="submit" size="large" variant="contained" color="inherit">
                    Thêm thể loại
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
