import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { theme } from '../../theme/theme';

export function ConversionResult({ amount, from, to, result }) {
  if (!result) return null;

  return (
    <Box>
      <h1 align="center">
        <span style={{ display: 'inline-block', marginRight: '10px', fontWeight: 300 }}>
          {amount} {from} =
        </span>
        <span style={{ color: theme.palette.info.main }}>
        {result} {to}
      </span>
      </h1>
      <Box>

      </Box>
    </Box>
  );
}

ConversionResult.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  from: PropTypes.string,
  to: PropTypes.string,
  result: PropTypes.string,
};

