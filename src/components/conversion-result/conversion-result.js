import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { theme } from '../../theme/theme';
import { CONVERSION_RESULT_ROUND, RATE_ROUND } from '../../constants/constants';

export function ConversionResult({ amount, from, to, rate }) {
  if (!rate) return null;

  return (
    <Box>
      <h1 align="center">
        <span style={{ display: 'inline-block', marginRight: '10px', fontWeight: 300 }}>
          {amount} {from} =
        </span>
        <span style={{ color: theme.palette.info.main }}>
        {(amount * rate).toFixed(CONVERSION_RESULT_ROUND)} {to}
      </span>
      </h1>
      <Box textAlign="center">
        <div style={{ marginBottom: '10px' }}>
          1 {from} = {rate.toFixed(RATE_ROUND)} {to}
        </div>
        <div>
          1 {to} = {(1 / rate).toFixed(RATE_ROUND)} {from}
        </div>
      </Box>
    </Box>
  );
}

ConversionResult.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  from: PropTypes.string,
  to: PropTypes.string,
  rate: PropTypes.number,
};

