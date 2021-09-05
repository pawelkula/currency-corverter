import PropTypes from 'prop-types';
import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { theme } from '../../theme/theme';
import { format, parseISO } from 'date-fns';

export function ExchangeTable({ exchangeData }) {
  return (
    <Box>
      <TableContainer style={{ width: '50%' }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Date</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Exchange Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exchangeData.map((row, index) => (
              <TableRow key={`row${index}`}>
                <TableCell>{format(parseISO(row.timestamp), 'yyyy/MM/dd')}</TableCell>
                <TableCell>{row.rate.toFixed(7)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

ExchangeTable.propTypes = {
  exchangeData: PropTypes.arrayOf(PropTypes.shape({
    timestamp: PropTypes.string,
    rate: PropTypes.number,
  }))
};
