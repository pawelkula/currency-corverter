import React from 'react';
import { Box } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export function ExchangeChart({ exchangeData, statisticsData }) {
  const min = statisticsData.find(el => el.label === 'Lowest');
  const max = statisticsData.find(el => el.label === 'Highest');
  const yDomain = [min?.rate, max?.rate];

  const normalizedExchangeData = exchangeData.map((el) => ({
    date: format(parseISO(el.timestamp), 'dd-MM'),
    value: el.rate.toFixed(3)
  }));

  return (
    <Box style={{ backgroundColor: 'white', width: '50%', height: '400px' }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={normalizedExchangeData}
          margin={{
            top: 30,
            right: 30,
            left: 30,
            bottom: 30,
          }}
        >
          <XAxis dataKey='date' />
          <YAxis domain={yDomain} hide />
          <Tooltip />
          <Line type='monotone' dataKey='value' stroke='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
