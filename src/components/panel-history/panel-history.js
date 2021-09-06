import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Paper from '@material-ui/core/Paper';
import { LOCAL_STORAGE_KEY } from '../../constants/constants';
import { theme } from '../../theme/theme';
import './panel-history.css';

export function PanelHistory() {
  const [logs, setLogs] = useState([]);
  const [hoveringId, setHoveringId] = useState('');

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

  function handleMouseOver(id) {
    if (hoveringId !== id) {
      setHoveringId(id);
    }
  }

  function handleMouseOut() {
   setHoveringId('');
  }

  function removeLogItem(id) {
    const updatedLogs = logs.filter((el) => el.id !== id);

    try {
      const updatedLogsStr = JSON.stringify(updatedLogs);

      localStorage.setItem(LOCAL_STORAGE_KEY, updatedLogsStr);
      setLogs(updatedLogs);
    } catch (e) {
      console.error('Cannot update logs in localStorage after remove');
    }
  }

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
                    <TableRow
                      key={`row${index}`}
                      onMouseEnter={() => handleMouseOver(row.id)}
                      onMouseLeave={handleMouseOut}
                    >
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.label}</TableCell>
                      <TableCell>
                        {
                          (row.id) && (
                            <Box style={{
                              display: 'flex'
                            }}>
                              <Box
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginRight: '30px',
                                  color: theme.palette.primary.main,
                                  cursor: 'pointer'
                                }}
                              >
                                <RemoveRedEyeIcon color="primary" style={{ fontSize: '16px' }} /> &nbsp; View
                              </Box>
                              <Box
                                onClick={() => removeLogItem(row.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: theme.palette.error.main,
                                  cursor: 'pointer'
                                }}
                              >
                                <DeleteForeverIcon style={{ fontSize: '16px' }} /> &nbsp; Delete from history
                              </Box>
                            </Box>
                          )
                        }
                      </TableCell>
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
