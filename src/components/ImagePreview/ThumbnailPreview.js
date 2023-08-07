import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

import Icon from './Icon';

// ----------------------------------------------------------------------
const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  padding: '40px',
  border: '1px dashed',
  borderColor: 'rgba(145, 158, 171, 0.4)',
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

const StyledLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
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

// ----------------------------------------------------------------------
ThumbnailPreview.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  setImage: PropTypes.func,
};

export default function ThumbnailPreview({ image, setImage }) {
  const [avatar, setAvatar] = useState(null);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!image) {
      setAvatar(null);
    } else if (typeof image === 'string') {
      setAvatar({
        preview: image,
      });
    } else {
      setAvatar({
        preview: URL.createObjectURL(image),
      });
      return () => avatar && URL.revokeObjectURL(avatar.preview);
    }
  }, [image]);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <StyledRoot>
      <StyledLabel>
        {avatar && <StyledImage src={avatar.preview} alt="avatar" />}
        <input type="file" hidden name="image" onChange={handleChangeImage} />
        <Icon width={200} height={150} />
        <Typography variant="h5" mt={2}>
          Tải lên tệp
        </Typography>
        <Typography gutterBottom>Thả tệp vào đây hoặc nhấp để tải lên</Typography>
      </StyledLabel>
    </StyledRoot>
  );
}
