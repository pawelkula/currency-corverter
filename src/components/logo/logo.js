import React from 'react';
import FindReplaceTwoToneIcon from '@material-ui/icons/FindReplaceTwoTone';
import { Box, withStyles } from '@material-ui/core';
import { theme } from '../../theme/theme';

const StyledLogoContainer = withStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '20px',
  },
})(Box);

export function Logo() {
  return (
    <StyledLogoContainer>
      <FindReplaceTwoToneIcon style={{ fill: theme.palette.primary.main }} />
      Currency<strong>Exchange</strong>
    </StyledLogoContainer>
  );
}
