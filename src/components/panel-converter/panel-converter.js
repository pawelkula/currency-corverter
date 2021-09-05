import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import CompareArrowsTwoToneIcon from '@material-ui/icons/CompareArrowsTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import currencies from '../../data/currencies.json';
import { Error } from '../error/error';
import { ExchangeHistory } from '../exchange-history/exchange-history';
import { ConversionResult } from '../conversion-result/conversion-result';
import './panel-converter.css';

function filterExchangeRates(data, currencies) {
  return data.filter((el) => currencies.some(currency => currency === el.currency ? el : false))
}

export function PanelConverter() {
  const [amount, setAmount] = useState(500);
  const [selectedFrom, setSelectedFrom] = React.useState('EUR');
  const [selectedTo, setSelectedTo] = React.useState('USD');
  const [exchangeRatesInUSD, setExchangeRatesInUSD] = React.useState([]);
  const [rate, setRate] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');

  useEffect(() => {
    fetch(`https://api.nomics.com/v1/exchange-rates?key=${process.env.REACT_APP_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        const rates = filterExchangeRates(data, currencies);
        setExchangeRatesInUSD(rates);
      })
      .catch(e => {
        setErrorMessage('Error: Cannot fetch currency rates.');
      });
  }, []);

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
