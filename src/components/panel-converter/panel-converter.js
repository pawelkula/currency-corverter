import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, TextField } from '@material-ui/core';
import CompareArrowsTwoToneIcon from '@material-ui/icons/CompareArrowsTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import currencies from '../../data/currencies.json';
import { Error } from '../error/error';

const CONVERSION_RESULT_ROUND = 2;

function filterExchangeRates(data, currencies) {
  return data.filter((el) => currencies.some(currency => currency.symbol === el.currency ? el : false))
}

export function PanelConverter() {
  const [amount, setAmount] = useState(0);
  const [selectedFrom, setSelectedFrom] = React.useState('');
  const [selectedTo, setSelectedTo] = React.useState('');
  const [exchangeRatesInUSD, setExchangeRatesInUSD] = React.useState([]);
  const [conversionResult, setConversionResult] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  useEffect(() => {
    fetch(`https://api.nomics.com/v1/exchange-rates?key=${process.env.REACT_APP_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        const rates = filterExchangeRates(data, currencies);
        setExchangeRatesInUSD(rates);
      })
      .catch(e => {
        setErrorMessage('Error: Cannot fetch currency rates...');
      });
  }, []);

  function fromOnChange(e, value) {
    setSelectedFrom(value ? value.symbol : '');
  }

  function toOnChange(e, value) {
    setSelectedTo(value ? value.symbol : '');
  }

  function amountOnChange(e) {
    setAmount(e.target.value );
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

    const fromRateInUSD = parseFloat(exchangeRatesInUSD.find(el => el.currency === selectedFrom)['rate']);
    const toRateInUSD = parseFloat(exchangeRatesInUSD.find(el => el.currency === selectedTo)['rate']);
    const rate = fromRateInUSD / toRateInUSD;
    const conversionAmount = (amount * rate).toFixed(CONVERSION_RESULT_ROUND);

    if (!isNaN(rate)) {
      setConversionResult(`${amount} ${selectedFrom} = ${conversionAmount} ${selectedTo}`);
    }
  }

  console.log('amount', amount);

  return (
    <Box className='panel-converter'>
      <h1 align="center">I want to convert</h1>
      <Box>
        <Box flexDirection='row' style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            label='Amount'
            onChange={(e) => amountOnChange(e)}
            style={{ marginRight: '30px' }}
            value={amount}
            type='number'
          />
          <Autocomplete
            id='from'
            options={currencies}
            onChange={fromOnChange}
            getOptionLabel={(option) => option.symbol}
            style={{ marginRight: '30px', width: 100 }}
            renderInput={(params) => <TextField {...params} label='From' />}
          />
          <IconButton aria-label='delete' style={{ marginRight: '30px' }}>
            <CompareArrowsTwoToneIcon />
          </IconButton>
          <Autocomplete
            id='to'
            options={currencies}
            onChange={toOnChange}
            getOptionLabel={(option) => option.symbol}
            style={{ marginRight: '30px', width: 100 }}
            renderInput={(params) => <TextField {...params} label='To' />}
          />
          <Button
            size='medium'
            color='primary'
            onClick={handleConvert}
            variant='contained'
          >
            Convert
          </Button>
        </Box>
        <Box>
          {
            errorMessage
              ? (<Error message={errorMessage} />)
              : (<h1 align='center'>{conversionResult}</h1>)
          }
        </Box>
      </Box>
    </Box>
  );
}
