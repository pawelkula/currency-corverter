import React from 'react'
import { Tab, withStyles } from '@material-ui/core';

export const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: 14,
    color: theme.palette.common.black,
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);
