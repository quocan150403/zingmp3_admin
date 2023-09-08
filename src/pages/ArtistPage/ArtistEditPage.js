import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
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
  Autocomplete,
} from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { artistApi } from '../../api';
import { CheckboxField, TextInputField, AvatarPreview, MultiAutocompleteField } from '../../components/form';

const JOBS = [
  'Ca sĩ',
  'Nhạc sĩ',
  'Rapper',
  'DJ',
  'Nhóm nhạc',
  'Nhà sản xuất',
  'Nhạc công',
  'Nhà soạn nhạc',
  'Diễn viên',
  'Đạo diễn',
  'Khác',
];

const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên nghệ sĩ'),
  stageName: yup.string().required('Vui lòng nhập nghệ danh nghệ sĩ'),
  bio: yup.string().required('Vui lòng nhập thông tin nghệ sĩ'),
  status: yup.boolean().default(true),
  roles: yup
    .array(yup.string())
    .min(1, 'Vui lòng chọn ít nhất một nghề nghiệp')
    .required('Vui lòng chọn ít nhất một nghề nghiệp'),
  image: yup.mixed().test('fileType', 'Vui lòng tải lên một tệp hình ảnh', (value) => {
    if (!value) return true;
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(value.type);
  }),
});
// ----------------------------------------------------------------------
export default function ArtistEditPage() {
  const [oldImage, setOldImage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await artistApi.getById(id);
        setValue('name', res.name);
        setValue('stageName', res.stageName);
        setValue('bio', res.bio);
        setValue('roles', res.roles);
        setValue('status', res.status);
        setOldImage(res.imageUrl);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGenre();
  }, [id]);

  const handleFormSubmit = async (data) => {
    try {
      const formData = createFormData(data);
      await updateData(formData);
      navigate('/dashboard/artist');
      toast.success('Cập nhật nghệ sĩ thành công');
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('stageName', data.stageName);
    formData.append('bio', data.bio);
    data.roles.forEach((role, index) => {
      formData.append(`roles[${index}]`, role);
    });
    formData.append('status', data.status);
    formData.append('image', data.image);
    return formData;
  };

  const updateData = async (formData) => {
    try {
      await toast.promise(artistApi.update(id, formData), {
        pending: 'Đang cập nhật nghệ sĩ...',
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
        <title> Cập Nhật Nghệ Sĩ | ZingMp3 </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Cập Nhật Nghệ Sĩ
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
                  imageUrl={oldImage}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={3} width="100%">
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <TextInputField
                      name="name"
                      inputType="text"
                      defaultValue=""
                      label="Nhập tên đầy đủ của nghệ sĩ"
                      control={control}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />

                    <TextInputField
                      name="stageName"
                      inputType="text"
                      defaultValue=""
                      label="Nhập nghệ danh của nghệ sĩ"
                      control={control}
                      error={!!errors.stageName}
                      helperText={errors.stageName?.message}
                    />
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <MultiAutocompleteField
                      name="roles"
                      label="Chọn nghề nghiệp"
                      limitTags={6}
                      options={JOBS}
                      control={control}
                      defaultValue={[JOBS[0]]}
                      error={!!errors.roles}
                      helperText={errors.roles?.message}
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                    />
                  </Stack>

                  <TextInputField
                    rows={4}
                    multiline
                    name="bio"
                    inputType="text"
                    defaultValue=""
                    label="Nhập mô tả"
                    control={control}
                    error={!!errors.bio}
                    helperText={errors.bio?.message}
                  />
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                  <CheckboxField name="status" label="Trạng thái" control={control} />

                  <Button type="submit" size="large" variant="contained" color="inherit">
                    Lưu Nghệ Sĩ
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
