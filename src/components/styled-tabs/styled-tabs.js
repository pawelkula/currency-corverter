import React from 'react';
import { Tabs, withStyles } from '@material-ui/core';
import { theme } from '../../theme/theme';

export const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: '3px',
    '& > span': {
      width: '100%',
      backgroundColor: theme.palette.primary.main,
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

