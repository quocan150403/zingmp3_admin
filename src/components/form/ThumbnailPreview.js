import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import { Typography } from '@mui/material';
import { IconFile } from './Icons';

const StyledRoot = styled('div')(({ theme, hasError }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '100%',
  height: '100%',
  padding: '40px',
  border: `1px dashed ${hasError ? theme.palette.error.main : 'rgba(145, 158, 171, 0.4)'}`,
  backgroundColor: 'rgba(145, 158, 171, 0.08)',
  borderRadius: '8px',
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    opacity: 0.72,
    cursor: 'pointer',
  },
}));

const StyledImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
}));

ThumbnailPreview.propTypes = {
  name: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  imageUrl: PropTypes.string,
};

export default function ThumbnailPreview({ name, form, error, helperText, imageUrl }) {
  const [hasChanged, setHasChanged] = useState(false);
  const { watch, setValue } = form;
  const image = watch(name);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(name, file);
        setHasChanged(true);
      }
    },
    [name, setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <>
      <StyledRoot {...getRootProps()} hasError={error} hasChanged={hasChanged}>
        {image && <StyledImage src={URL.createObjectURL(image)} alt="avatar" />}
        {!image && imageUrl && <StyledImage src={imageUrl} alt="avatar" />}
        <input {...getInputProps()} />
        <IconFile width={200} height={150} />
        <Typography variant="h5" mt={2}>
          Tải lên tệp
        </Typography>
        <Typography gutterBottom>Thả tệp vào đây hoặc nhấp để tải lên</Typography>
        {error && <Typography color="error">{helperText}</Typography>}
      </StyledRoot>
    </>
  );
}
