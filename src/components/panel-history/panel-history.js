import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { LOCAL_STORAGE_KEY } from '../../constants/constants';
import { theme } from '../../theme/theme';
import './panel-history.css';

export function PanelHistory() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    try {
      const logsData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedData = JSON.parse(logsData);
      if (parsedData) {
        setLogs(parsedData);
      }
    } catch (e) {
      console.error('Cannot parse logs from localStorage');
    }
  }, []);

  return (
    <Box className='panel-history'>
      <h1>Conversion history</h1>
      {
        !!logs.length && (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Date</TableCell>
                    <TableCell style={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Event</TableCell>
                    <TableCell style={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((row, index) => (
                    <TableRow key={`row${index}`}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.label}</TableCell>
                      <TableCell />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )
      }
    </Box>
  );
}
