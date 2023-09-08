import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Card, Typography, Container, Stack, Button, Grid } from '@mui/material';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// api
import { artistApi, albumApi, genreApi } from '../../api';
// comp
import { TextInputField, CheckboxField, ThumbnailPreview, MultiAutocompleteField } from '../../components/form';

const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên nghệ sĩ'),
  status: yup.boolean().default(true),
  genres: yup
    .array(yup.object())
    .min(1, 'Vui lòng chọn ít nhất một thể loại')
    .required('Vui lòng chọn ít nhất một thể loại'),
  artists: yup
    .array(yup.object())
    .min(1, 'Vui lòng chọn ít nhất một nghệ sĩ')
    .required('Vui lòng chọn ít nhất một nghệ sĩ'),
  image: yup.mixed().test('fileType', 'Vui lòng tải lên một tệp hình ảnh', (value) => {
    if (!value) return true;
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(value.type);
  }),
});
// ----------------------------------------------------------------------
export default function AlbumEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [oldImage, setOldImage] = useState();
  const [artistList, setArtistList] = useState([]);
  const [genreList, setGenreList] = useState([]);
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
    const fetchData = async () => {
      try {
        const artistData = await artistApi.getQuery();
        const genreData = await genreApi.getQuery();
        setArtistList(artistData);
        setGenreList(genreData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await albumApi.getById(id);
        setValue('name', res.name);
        setValue('artists', res.artists);
        setValue('genres', res.genres);
        setValue('status', res.status);
        setOldImage(res.imageUrl);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const handleFormSubmit = async (data) => {
    try {
      const formData = createFormData(data);
      await updateData(formData);
      navigate('/dashboard/album');
      toast.success('Cập nhật album thành công!');
    } catch (error) {
      console.log(error);
    }
  };

  const createFormData = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('image', data.image);
    data.genres.forEach((genre, index) => {
      formData.append(`genres[${index}]`, genre._id);
    });
    data.artists.forEach((artist, index) => {
      formData.append(`artists[${index}]`, artist._id);
    });
    formData.append('status', data.status);
    return formData;
  };

  const updateData = async (formData) => {
    try {
      await toast.promise(albumApi.update(id, formData), {
        pending: 'Đang cập nhật album...',
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
        <title> Cập Nhật Banner | ZingMp3 </title>
      </Helmet>

      <Container>
        <Typography variant="h4" mb={5}>
          Cập nhật Album
        </Typography>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} mb={3} width="100%">
                  <TextInputField
                    name="name"
                    inputType="text"
                    defaultValue=""
                    label="Nhập tên album"
                    control={control}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <MultiAutocompleteField
                      name="genres"
                      label="Chọn thể loại"
                      limitTags={2}
                      options={genreList}
                      control={control}
                      defaultValue={[]}
                      error={!!errors.genres}
                      helperText={errors.genres?.message}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                    />
                    <MultiAutocompleteField
                      name="artists"
                      label="Chọn nghệ sĩ tham gia"
                      limitTags={2}
                      options={artistList}
                      control={control}
                      defaultValue={[]}
                      error={!!errors.artists}
                      helperText={errors.artists?.message}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
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
                      imageUrl={oldImage}
                      helperText={errors.image?.message}
                    />
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                  <CheckboxField name="status" label="Trạng thái" control={control} />

                  <Button type="submit" size="large" variant="contained" color="inherit">
                    Lưu album
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
