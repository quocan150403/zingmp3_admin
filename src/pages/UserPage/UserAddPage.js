import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Typography, Container, Stack, Button, Grid } from '@mui/material';
// toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { userApi } from '../../api';
import { AvatarPreview, CheckboxField, SelectField, TextInputField } from '../../components/form';

const ROLES = ['User', 'Admin'];

const schema = yup.object().shape({
  fullName: yup.string().required('Vui lòng nhập tên người dùng'),
  email: yup.string().required('Vui lòng nhập email người dùng'),
  password: yup.string().required('Vui lòng nhập password người dùng'),
  status: yup.boolean().default(true),
  role: yup.string().required('Vui lòng chọn vai trò'),
  image: yup.mixed().test('fileType', 'Vui lòng tải lên một tệp hình ảnh', (value) => {
    if (!value) return false;
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(value.type);
  }),
});

// ----------------------------------------------------------------------
export default function UserAddPage() {
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

  const handleFormSubmit = async (data) => {
    try {
      const formData = createFormData(data);
      await addData(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = (data) => {
    const formData = new FormData();
    formData.append('UID', '6');
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('role', data.role);
    formData.append('status', data.status);
    formData.append('image', data.image);
    return formData;
  };

  const addData = async (formData) => {
    try {
      await toast.promise(userApi.add(formData), {
        pending: 'Đang thêm người dùng...',
        success: 'Thêm người dùng thành công!',
      });
      reset();
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
        <title> Thêm Người Dùng | ZingMp3 </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Thêm người dùng
        </Typography>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, pt: 10 }}>
                <AvatarPreview
                  name="image"
                  form={{ watch, setValue }}
                  error={!!errors.image}
                  helperText={errors.image?.message}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={3} width="100%">
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <TextInputField
                      name="fullName"
                      inputType="text"
                      defaultValue=""
                      label="Nhập tên đầy đủ "
                      control={control}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />
                    <SelectField
                      name="role"
                      label="Chọn vai trò"
                      defaultValue={ROLES[0]}
                      options={ROLES}
                      control={control}
                      error={!!errors.role}
                      helperText={errors.role?.message}
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <TextInputField
                      name="email"
                      inputType="email"
                      defaultValue=""
                      label="Nhập địa chỉ email"
                      control={control}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                    <TextInputField
                      name="password"
                      inputType="password"
                      defaultValue=""
                      label="Nhập mật khẩu"
                      control={control}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                  <CheckboxField name="status" label="Trạng thái" control={control} />

                  <Button type="submit" size="large" variant="contained" color="inherit">
                    Thêm Người dùng
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
