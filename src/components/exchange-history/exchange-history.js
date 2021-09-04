import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  withStyles,
} from '@material-ui/core';
import {
  INITIAL_EXCHANGE_DISPLAY_MODE,
  INITIAL_EXCHANGE_HISTORY_TIME_FRAME,
} from '../../constants/constants';
import { format, sub } from 'date-fns';
import { theme } from '../../theme/theme';
import { Error } from '../error/error';
import { ExchangeTable } from '../exchange-table/exchange-table';

const GreenRadio = withStyles({
  root: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

export function ExchangeHistory({ selectedCurrency }) {
  const [timeFrame, setTimeFrame] = useState(INITIAL_EXCHANGE_HISTORY_TIME_FRAME);
  const [displayMode, setDisplayMode] = useState(INITIAL_EXCHANGE_DISPLAY_MODE);
  const [errorMessage, setErrorMessage] = useState('');
  const [exchangeData, setExchangeData] = useState([]);

  useEffect(() => {
    const now = new Date();
    now.setUTCHours(0,0,0,0);

    const startDate = format(now, 'yyyy-MM-dd');
    const endDate = format(sub(now, { days: timeFrame - 1}), 'yyyy-MM-dd');

    const API_URL = `https://api.nomics.com/v1/exchange-rates/history?key=${process.env.REACT_APP_API_KEY}&currency=${selectedCurrency}&start=${endDate}T00%3A00%3A00Z&end=${startDate}T00%3A00%3A00Z`;

    if (selectedCurrency) {
      fetch(API_URL)
        .then(response => response.json())
        .then(data => {
          console.log('data hist');
          console.log(data);
          setExchangeData(data.reverse());
        })
        .catch(e => {
          setErrorMessage('Error: Cannot fetch exchange rates...');
        });
    }
  }, [selectedCurrency, timeFrame])

  function handleSelectChange(e) {
   setTimeFrame(e.target.value);
  }

  function handleRadioChange(e) {
    setDisplayMode(e.target.value);
  }

  return (
    <Box style={{ borderTop: '1px solid grey' }}>
      <Box>
        <h2 style={{ marginBottom: '30px' }}>Exchange History</h2>
      </Box>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          width: '50%'
        }}
      >
        <FormControl>
          <InputLabel htmlFor="exchangeHistorySelect">Duration</InputLabel>
          <Select
            id="exchangeHistorySelect"
            onChange={handleSelectChange}
            value={timeFrame}
            style={{ width: '180px' }}
          >
            <MenuItem value={7}>7 days</MenuItem>
            <MenuItem value={14}>14 days</MenuItem>
            <MenuItem value={30}>30 days</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" flexDirection="row">
          <FormControl>
            <RadioGroup
              style={{ flexDirection: 'row' }}
              name="display-mode-radio-group"
              value={displayMode}
              onChange={handleRadioChange}
            >
              <FormControlLabel value="table" control={<GreenRadio />} label="Table" />
              <FormControlLabel value="chart" control={<GreenRadio />} label="Chart" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Box style={{ marginBottom: '100px' }}>
        {
          errorMessage
            ? (<Error message={errorMessage}/>)
            : (<ExchangeTable exchangeData={exchangeData} />)
        }
      </Box>
    </Box>
  );
}