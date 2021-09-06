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
import { ExchangeStatistics } from '../exchange-statistics/exchange-statistics';
import { arrayAverage } from '../../utils/array';
import { ExchangeChart } from '../exchange-chart/exchange-chart';

const GreenRadio = withStyles({
  root: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
})((props) => <Radio color='default' {...props} />);

function calculateRatesHistory(data) {
  try {
    return data[0].map((el, index) => ({
      timestamp: el.timestamp,
      rate: (parseFloat(el.rate) / parseFloat(data[1][index]['rate'])),
    }));
  } catch (e) {
    console.error('Error: Cannot calculate rates history');
    return [];
  }
}

function calculateStatistics(data) {
  try {
    const rates = data.map(el => el.rate);
    const lowest = Math.min(...rates);
    const highest = Math.max(...rates);
    const average = arrayAverage(rates);

    return [
      { label: 'Lowest', rate: lowest },
      { label: 'Highest', rate: highest },
      { label: 'Average', rate: average },
    ];
  } catch (e) {
    console.error('Error: Cannot calculate statistics.');
    return [];
  }
}

export function ExchangeHistory({ rate, selectedFrom, selectedTo }) {
  const [timeFrame, setTimeFrame] = useState(INITIAL_EXCHANGE_HISTORY_TIME_FRAME);
  const [displayMode, setDisplayMode] = useState(INITIAL_EXCHANGE_DISPLAY_MODE);
  const [errorMessage, setErrorMessage] = useState('');
  const [exchangeData, setExchangeData] = useState([]);
  const [statisticsData, setStatisticsData] = useState([]);

  async function fetchAllExchangeRates(selectedFrom, selectedTo, timeFrame) {
    setErrorMessage('');

    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const startDate = format(now, 'yyyy-MM-dd');
    const endDate = format(sub(now, { days: timeFrame - 1 }), 'yyyy-MM-dd');

    const FROM_API_URL = `https://api.nomics.com/v1/exchange-rates/history?key=${process.env.REACT_APP_API_KEY}&currency=${selectedFrom}&start=${endDate}T00%3A00%3A00Z&end=${startDate}T00%3A00%3A00Z`;
    const TO_API_URL = `https://api.nomics.com/v1/exchange-rates/history?key=${process.env.REACT_APP_API_KEY}&currency=${selectedTo}&start=${endDate}T00%3A00%3A00Z&end=${startDate}T00%3A00%3A00Z`;

    const data0 = await fetch(FROM_API_URL)
      .then(response => response.json())
      .then(data => data.reverse())
      .catch(() => setErrorMessage('Error: Cannot fetch exchange rates.'));

    // UGLY HACK to solve the issue with free nomics.com license:
    // Error 429: too many calls if there are more than one API call per second...
    // To see the original solution, check out the commit: 817ce5f
    setTimeout(() => {
      console.log('second call "/exchange-rates/history/" API after 1.1 sec...');
      fetch(TO_API_URL)
        .then(response => response.json())
        .then(data => {
          const data1 = data.reverse();

          const d = [data0, data1];
          const rateHistory = calculateRatesHistory(d);

          setExchangeData(rateHistory);
          setStatisticsData(calculateStatistics(rateHistory));

          return null;

        })
        .catch(() => setErrorMessage('Error: Cannot fetch exchange rates.'));
    }, 1100);
  }

  useEffect(() => {
    if (selectedFrom && selectedTo && rate !== 0) {
      fetchAllExchangeRates(selectedFrom, selectedTo, timeFrame);
    } else {
      setExchangeData([]);
      setStatisticsData([]);
    }
  }, [selectedFrom, selectedTo, rate, timeFrame]);

  function handleSelectChange(e) {
    setTimeFrame(e.target.value);
  }

  function handleRadioChange(e) {
    setDisplayMode(e.target.value);
  }

  if (!rate) return null;

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
          width: '50%',
        }}
      >
        <FormControl>
          <InputLabel htmlFor='exchangeHistorySelect'>Duration</InputLabel>
          <Select
            id='exchangeHistorySelect'
            onChange={handleSelectChange}
            value={timeFrame}
            style={{ width: '180px' }}
          >
            <MenuItem value={7}>7 days</MenuItem>
            <MenuItem value={14}>14 days</MenuItem>
            <MenuItem value={30}>30 days</MenuItem>
          </Select>
        </FormControl>
        <Box display='flex' flexDirection='row'>
          <FormControl>
            <RadioGroup
              style={{ flexDirection: 'row' }}
              name='display-mode-radio-group'
              value={displayMode}
              onChange={handleRadioChange}
            >
              <FormControlLabel value='table' control={<GreenRadio />} label='Table' />
              <FormControlLabel value='chart' control={<GreenRadio />} label='Chart' />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Box style={{ marginBottom: '100px' }}>
        {
          errorMessage
            ? (<Error message={errorMessage} />)
            : (<Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              {
                displayMode === INITIAL_EXCHANGE_DISPLAY_MODE
                  ? (<ExchangeTable exchangeData={exchangeData} />)
                  : (<ExchangeChart exchangeData={exchangeData} statisticsData={statisticsData} />)
              }
              <ExchangeStatistics statisticsData={statisticsData} />
            </Box>)
        }
      </Box>
    </Box>
  );
}