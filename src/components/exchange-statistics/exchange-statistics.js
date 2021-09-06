import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { theme } from '../../theme/theme';

export function ExchangeStatistics({ statisticsData = [] }) {
  return (
    <Box style={{ width: '50%' }}>
      <TableContainer style={{ width: '98%', float: 'right' }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Statistics</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {statisticsData.map((row, index) => (
              <TableRow key={`rowStats${index}`}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.rate.toFixed(7)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}