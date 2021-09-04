import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import CompareArrowsTwoToneIcon from '@material-ui/icons/CompareArrowsTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import currencies from '../../data/currencies.json';
import { Error } from '../error/error';
import { ExchangeHistory } from '../exchange-history/exchange-history';
import './panel-converter.css';
import { ConversionResult } from '../conversion-result/conversion-result';

const CONVERSION_RESULT_ROUND = 3;

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

  function fromOnInputChange(e, value) {
    setSelectedFrom(value);
    setConversionResult('');
  }

  function toOnInputChange(e, value) {
    setSelectedTo(value);
    setConversionResult('');
  }

  function amountOnChange(e) {
    setAmount(e?.target?.value || '');
    setConversionResult('');
  }

  function handleSwitch() {
    if (selectedFrom && selectedTo) {
      setSelectedFrom(selectedTo);
      setSelectedTo(selectedFrom)
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

    const fromRateInUSD = parseFloat(exchangeRatesInUSD.find(el => el.currency === selectedFrom)['rate']);
    const toRateInUSD = parseFloat(exchangeRatesInUSD.find(el => el.currency === selectedTo)['rate']);
    const rate = fromRateInUSD / toRateInUSD;
    const conversionAmount = (amount * rate).toFixed(CONVERSION_RESULT_ROUND);

    if (!isNaN(rate)) {
      setConversionResult(conversionAmount);
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
            options={currencies}
            onInputChange={fromOnInputChange}
            inputValue={selectedFrom}
            getOptionLabel={(option) => option.symbol}
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
            options={currencies}
            inputValue={selectedTo}
            onInputChange={toOnInputChange}
            getOptionLabel={(option) => option.symbol}
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
                  result={conversionResult}
                />
              )
          }
        </Box>
        <Box style={{ marginTop: '50px' }}>
          <ExchangeHistory
            selectedCurrency={selectedFrom}
          />
        </Box>
      </Box>
    </Box>
  );
}
