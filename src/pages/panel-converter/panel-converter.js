import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import CompareArrowsTwoToneIcon from '@material-ui/icons/CompareArrowsTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { format } from 'date-fns';
import currencies from '../../data/currencies.json';
import { Error } from '../../components/error/error';
import { ExchangeHistory } from '../../components/exchange-history/exchange-history';
import { ConversionResult } from '../../components/conversion-result/conversion-result';
import { LOCAL_STORAGE_KEY } from '../../constants/constants';
import './panel-converter.css';

function filterExchangeRates(data, currencies) {
  return data.filter((el) => currencies.some(currency => currency === el.currency ? el : false))
}

function createHistoryLogItem(amount, from, to) {
  try {
    const now = Date.now();
    return {
      id: format(now, 'yyyyMMddHHmmssSS'),
      date: format(now, 'dd/MM/yyyy \'@\' HH:mm'),
      amount,
      from,
      to
    }
  } catch (e) {
    console.error('Cannot create a history log.');
    return null;
  }
}

export function PanelConverter({ conversionParams, executeConversion }) {
  const [amount, setAmount] = useState(conversionParams.amount);
  const [selectedFrom, setSelectedFrom] = React.useState(conversionParams.from);
  const [selectedTo, setSelectedTo] = React.useState(conversionParams.to);
  const [exchangeRatesInUSD, setExchangeRatesInUSD] = React.useState([]);
  const [rate, setRate] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [logItem, setLogItem] = React.useState(null);

  const fetchData = async () => {
    const result = await fetch(`https://api.nomics.com/v1/exchange-rates?key=${process.env.REACT_APP_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        return filterExchangeRates(data, currencies);
      })
      .catch(e => {
        setErrorMessage('Error: Cannot fetch currency rates.');
      });
    setExchangeRatesInUSD(result);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (logItem) {
      try {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
        const logsArr = localData ? JSON.parse(localData) : [];

        logsArr.push(logItem);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logsArr));
      } catch (e) {
        console.error('Cannot save log item to localStorage');
      }
    }
  }, [logItem])

  useEffect(() => {
    if (executeConversion) {
      handleConvert();
    }
  }, [executeConversion, exchangeRatesInUSD])

  function fromOnInputChange(e, value) {
    setSelectedFrom(value);
    setRate(0);
  }

  function toOnInputChange(e, value) {
    setSelectedTo(value);
    setRate(0);
  }

  function amountOnChange(e) {
    setAmount(e?.target?.value || '');
    setRate(0);
  }

  function handleSwitch() {
    if (selectedFrom && selectedTo) {
      setSelectedFrom(selectedTo);
      setSelectedTo(selectedFrom);
      setRate(0);
    }
  }

  function handleConvert() {
    if (amount === 0) {
      setErrorMessage('Please type the amount...');
      return;
    }
    if (!selectedFrom) {
      setErrorMessage('Please select the source currency');
      return;
    }

    if (!selectedTo) {
      setErrorMessage('Please select the target currency');
      return;
    }

    setErrorMessage('');

    if (exchangeRatesInUSD.length) {
      const fromRateInUSD = parseFloat(exchangeRatesInUSD.find(el => el.currency === selectedFrom)['rate']);
      const toRateInUSD = parseFloat(exchangeRatesInUSD.find(el => el.currency === selectedTo)['rate']);
      const rate = fromRateInUSD / toRateInUSD;

      if (!isNaN(rate)) {
        setRate(rate);

        const newLogItem = createHistoryLogItem(amount, selectedFrom, selectedTo);

        if (newLogItem) {
          setLogItem(newLogItem);
        }
      }
    }
  }

  return (
    <Box className='panel-converter'>
      <h1>I want to convert</h1>
      <Box>
        <Box flexDirection='row' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <TextField
            label='Amount'
            onChange={(e) => amountOnChange(e)}
            style={{ marginRight: '30px', width: '70%' }}
            value={amount}
            type='number'
          />
          <Autocomplete
            id='from'
            value={selectedFrom}
            options={currencies}
            onInputChange={fromOnInputChange}
            inputValue={selectedFrom}
            getOptionLabel={(option) => option}
            style={{ marginRight: '30px', width: '100%' }}
            renderInput={(params) => <TextField {...params} label='From' />}
          />
          <Box style={{ marginRight: '30px' }}>
            <Button
              size='small'
              color='secondary'
              onClick={handleSwitch}
              variant='contained'
              style={{ minWidth: '40px' }}
            >
              <CompareArrowsTwoToneIcon color='primary' />
            </Button>
          </Box>
          <Autocomplete
            id='to'
            value={selectedTo}
            options={currencies}
            inputValue={selectedTo}
            onInputChange={toOnInputChange}
            getOptionLabel={(option) => option}
            style={{ marginRight: '30px', width: '100%' }}
            renderInput={(params) => <TextField {...params} label='To' />}
          />
          <Box style={{ marginRight: '30px' }}>
            <Button
              size='small'
              color='primary'
              onClick={handleConvert}
              variant='contained'
            >
              Convert
            </Button>
          </Box>
        </Box>
        <Box style={{ marginTop: '50px', height: '100px' }}>
          {
            errorMessage
              ? (<Error message={errorMessage} />)
              : (
                <ConversionResult
                  amount={amount}
                  from={selectedFrom}
                  to={selectedTo}
                  rate={rate}
                />
              )
          }
        </Box>
        <Box style={{ marginTop: '80px' }}>
          <ExchangeHistory
            selectedFrom={selectedFrom}
            selectedTo={selectedTo}
            rate={rate}
          />
        </Box>
      </Box>
    </Box>
  );
}
