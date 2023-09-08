import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import { Typography } from '@mui/material';
import { IconAvatar } from './Icons';

const StyledRoot = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyleBox = styled('div')(({ theme }) => ({
  width: '144px',
  height: '144px',
  padding: '8px',
  border: '1px dashed',
  borderColor: 'rgba(145, 158, 171, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    opacity: 0.72,
    cursor: 'pointer',
  },
}));

const StyledWrap = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  backgroundColor: 'rgba(145, 158, 171, 0.08)',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    opacity: 0.8,
    cursor: 'pointer',
  },
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '50%',
  position: 'absolute',
  top: 0,
  left: 0,
}));

AvatarPreview.propTypes = {
  name: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  imageUrl: PropTypes.string,
};

export default function AvatarPreview({ name, form, error, helperText, imageUrl }) {
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
        <StyleBox>
          <StyledWrap>
            <IconAvatar width={32} height={32} />
            {image && <StyledImage src={URL.createObjectURL(image)} alt="avatar" />}
            {!image && imageUrl && <StyledImage src={imageUrl} alt="avatar" />}
            <input {...getInputProps()} />
            <Typography variant="caption" sx={{ mt: 1 }}>
              Chọn ảnh
            </Typography>
          </StyledWrap>
        </StyleBox>
        <Typography gutterBottom variant="caption" sx={{ mt: 3, textAlign: 'center' }}>
          Chỉ chấp nhận ảnh JPG, GIF, hoặc PNG.
          <br />
          Tối đa 500KB
        </Typography>
        {error && <Typography color="error">{helperText}</Typography>}
      </StyledRoot>
    </>
  );
}
