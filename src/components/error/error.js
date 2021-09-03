import React from 'react';
import { Box } from '@material-ui/core';
import { theme } from '../../theme/theme';

export function Error({ message }) {
  return (
      <Box style={{
        backgroundColor: theme.palette.common.white,
        border: `1px solid ${theme.palette.error.main}`,
        color: theme.palette.error.main,
        display: 'flex',
        margin: '30px auto',
        padding: '20px',
        textAlign: 'center',
        width: 'max-content'
      }}>
        {message}
      </Box>
  )
}