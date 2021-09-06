import React, { useState } from 'react';
import { Box, ThemeProvider } from '@material-ui/core';
import { theme } from './theme/theme';
import { Logo } from './components/logo/logo';
import { StyledTab } from './components/styled-tab/styled-tab';
import { StyledTabs } from './components/styled-tabs/styled-tabs';
import { StyledLogout } from './components/styled-logout/styled-logout';
import { TabPanel } from './components/tab-panel/tab-panel';
import { PanelConverter } from './pages/panel-converter/panel-converter';
import { PanelHistory } from './pages/panel-history/panel-history';
import './app.css';

const initialConversionParams = {
  amount: 500,
  from: 'EUR',
  to: 'USD'
}

function App() {
  const [value, setValue] = useState(0);
  const [conversionParams, setConversionParams] = useState(initialConversionParams);
  const [executeConversion, setExecuteConversion] = useState(false);

  function handleChange(event, newValue) {
    setExecuteConversion(false);
    setValue(newValue);
  }

  function handleLogItemClick(params) {
    setConversionParams(params);
    setValue(0);
    setExecuteConversion(true);
  }

  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        <Box className="app-bar">
          <Box className='app-bar-content' position='static'>
            <Logo />
            <StyledTabs
              centered
              onChange={handleChange}
              value={value}
              aria-label="tabs"
            >
              <StyledTab
                label='Currency converter'
                {...a11yProps(0)}
              />
              <StyledTab
                label='View conversation history'
                {...a11yProps(1)}
              />
            </StyledTabs>
            <StyledLogout>
              Logout
            </StyledLogout>
          </Box>
        </Box>
        <Box className="app-container">
          <TabPanel value={value} index={0}>
            <PanelConverter
              conversionParams={conversionParams}
              executeConversion={executeConversion}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PanelHistory
              onLogItemClick={handleLogItemClick}
            />
          </TabPanel>
        </Box>
      </>
    </ThemeProvider>
  );
}

export default App;