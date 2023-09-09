import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Card, Typography, Container, Stack, Grid, Button } from '@mui/material';
// toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  CheckboxField,
  TextInputField,
  MultiAutocompleteField,
  ThumbnailPreview,
  AutocompleteField,
  AudioFileInput,
} from '../../components/form';
import { songApi, artistApi, albumApi } from '../../api';

const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên nghệ sĩ'),
  lyric: yup.string().default(''),
  albumId: yup.object().required('Vui lòng chọn album'),
  status: yup.boolean().default(true),
  artists: yup
    .array(yup.object())
    .min(1, 'Vui lòng chọn ít nhất một nghệ sĩ')
    .required('Vui lòng chọn ít nhất một nghệ sĩ'),
  composers: yup
    .array(yup.object())
    .min(1, 'Vui lòng chọn ít nhất một tác giả')
    .required('Vui lòng chọn ít nhất một tác giả'),
  image: yup.mixed().test('fileType', 'Vui lòng tải lên một tệp hình ảnh', (value) => {
    if (!value) return false;
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(value.type);
  }),
  audio: yup.mixed().test('fileType', 'Vui lòng tải lên một tệp âm thanh', (value) => {
    if (!value) return false;
    const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
    return audioTypes.includes(value.type);
  }),
});

// ----------------------------------------------------------------------
export default function SongAddPage() {
  const [artistList, setArtistList] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const albumId = searchParams.get('albumId');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistData, albumData] = await Promise.all([artistApi.getQuery(), albumApi.getQuery()]);
        setArtistList(artistData);
        setAlbumList(albumData);
        if (albumId) {
          const currentAlbum = albumData.filter((item) => item._id === albumId);
          setValue('albumId', currentAlbum);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [albumId]);

  const handleFormSubmit = async (data) => {
    try {
      data.duration = await getAudioDuration(data.audio);
      const formData = createFormData(data);
      await addData(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const getAudioDuration = async (file) =>
    new Promise((resolve) => {
      const audio = new Audio(URL.createObjectURL(file));
      audio.addEventListener('loadedmetadata', () => {
        const durationInSeconds = Math.floor(audio.duration);
        resolve(durationInSeconds);
      });
    });

  const createFormData = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('image', data.image);
    formData.append('lyric', data.lyric);
    formData.append('albumId', data.albumId._id);
    data.artists.forEach((artist, index) => {
      formData.append(`artists[${index}]`, artist._id);
    });
    data.composers.forEach((composer, index) => {
      formData.append(`composers[${index}]`, composer._id);
    });
    formData.append('duration', data.duration);
    formData.append('audio', data.audio);
    formData.append('status', data.status);
    return formData;
  };

  const addData = async (formData) => {
    try {
      await toast.promise(songApi.add(formData), {
        pending: 'Đang thêm bài hát...',
        success: 'Thêm bài hát thành công!',
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
        <title> Thêm Bài Hát | ZingMp3 </title>
      </Helmet>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Container>
          <Typography variant="h4" mb={5}>
            Thêm Bài Hát
          </Typography>

          {/* Info Basic */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Chi tiết bài hát</Typography>
              <Typography variant="caption">Nhập tên bài hát, hình ảnh</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} width="100%">
                  <TextInputField
                    name="name"
                    inputType="text"
                    defaultValue=""
                    label="Nhập tên bài hát"
                    control={control}
                    error={!!errors.name}
                    helperText={errors.name?.message}
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
              </Card>
            </Grid>
          </Grid>

          {/* Properties */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Thuộc tính</Typography>
              <Typography variant="caption">Nhập thời lượng,chủ đề,...</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2} mb={3} direction="row" justifyContent="space-between" width="100%">
                  <AutocompleteField
                    label="Chọn album"
                    name="albumId"
                    options={albumList}
                    getOptionLabel={(option) => option.name}
                    defaultValue={''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    control={control}
                    error={!!errors.albumId}
                    helperText={errors.albumId?.message}
                  />
                </Stack>

                <Stack spacing={2} mb={3} direction="row" justifyContent="space-between" width="100%">
                  <MultiAutocompleteField
                    name="artists"
                    label="Chọn nghệ sĩ trình bày"
                    options={artistList}
                    control={control}
                    defaultValue={[]}
                    error={!!errors.artists}
                    helperText={errors.artists?.message}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                  />
                  <MultiAutocompleteField
                    name="composers"
                    label="Chọn tác giả sáng tác"
                    options={artistList}
                    control={control}
                    defaultValue={[]}
                    error={!!errors.composers}
                    helperText={errors.composers?.message}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                  />
                </Stack>

                <TextInputField
                  rows={7}
                  multiline
                  name="lyric"
                  inputType="text"
                  defaultValue=""
                  label="Nhập lời bài hát"
                  control={control}
                  error={!!errors.lyric}
                  helperText={errors.lyric?.message}
                />
              </Card>
            </Grid>
          </Grid>

          {/* File */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Upload bài hát</Typography>
              <Typography variant="caption">Chọn file bài hát</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <AudioFileInput
                  name="audio"
                  form={{ watch, setValue }}
                  error={!!errors.audio}
                  helperText={errors.audio?.message}
                />
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} justifyContent="flex-end" mb={3}>
            <Grid item xs={12} md={8}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <CheckboxField name="status" label="Trạng thái" control={control} />

                <Button type="submit" size="large" variant="contained" color="inherit">
                  Thêm bài hát mới
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </form>
    </>
  );
}
