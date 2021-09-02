import React from 'react';
import { Box, ThemeProvider } from '@material-ui/core';
import { theme } from './theme/theme';
import { Logo } from './components/logo/logo';
import { StyledTab } from './components/styled-tab/styled-tab';
import { StyledTabs } from './components/styled-tabs/styled-tabs';
import { StyledLogout } from './components/styled-logout/styled-logout';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = React.useState(0);
  const handleChange = (event, newValue) => {
    console.log('Change');
    setActiveTab(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className='appbar' position='static'>
        <Logo />
        <StyledTabs
          centered
          onChange={handleChange}
          value={activeTab}
        >
          <StyledTab
            label='Currency Converter'
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
    </ThemeProvider>
  );
}

export default App;