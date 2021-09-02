import { Box, withStyles } from '@material-ui/core';
import { theme } from '../../theme/theme';

export const StyledLogout = withStyles({
  root: {
    color: theme.palette.primary.main,
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'uppercase'
  }
})(Box);
