import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography, Stack, Box } from '@mui/material';

export default function AudioFileInput({ name, form, error, helperText, audioUrl }) {
  const { watch, setValue } = form;
  const audio = watch(name);
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(name, file);
      }
    },
    [name, setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'audio/*',
    multiple: false,
  });

  return (
    <Stack spacing={2}>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <Typography variant="body2">Thả tệp âm thanh vào đây hoặc nhấn để chọn</Typography>
      </div>
      {audio && <Typography variant="body2">{audio.name}</Typography>}
      {error && (
        <Typography variant="body2" color="error">
          {helperText}
        </Typography>
      )}
      {audioUrl && (
        <Box>
          <audio controls style={{ marginTop: '10px' }}>
            <source src={audioUrl} />
            <track kind="captions" label="English" src="captions.vtt" default />
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}
    </Stack>
  );
}

const dropzoneStyles = {
  border: '2px dashed #aaaaaa',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: '10px',
  backgroundColor: '#f5f5f5',
};
