import React from 'react';
import { Box, ThemeProvider } from '@material-ui/core';
import { theme } from './theme/theme';
import { Logo } from './components/logo/logo';
import { StyledTab } from './components/styled-tab/styled-tab';
import { StyledTabs } from './components/styled-tabs/styled-tabs';
import { StyledLogout } from './components/styled-logout/styled-logout';
import { TabPanel } from './components/tab-panel/tab-panel';
import { PanelConverter } from './components/panel-converter/panel-converter';
import './app.css';
import { PanelHistory } from './components/panel-history/panel-history';

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    console.log('Change: ', newValue);
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  console.log('value', value);

  return (
    <ThemeProvider theme={theme}>
      <>
        <Box className='app-bar' position='static'>
          <Logo />
          <StyledTabs
            centered
            onChange={handleChange}
            value={value}
            aria-label="tabs"
          >
            <StyledTab
              label='Currency PanelConverter'
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
        <Box className="app-container">
          <TabPanel value={value} index={0}>
            <PanelConverter />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PanelHistory />
          </TabPanel>
        </Box>
      </>
    </ThemeProvider>
  );
}

export default App;