import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardPreview,
  Button,
  Text,
  Title1,
  Title2,
  Subtitle1,
  Badge,
  Spinner,
  makeStyles,
  tokens,
  shorthands,
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridCell,
  DataGridBody,
  TableColumnDefinition,
  createTableColumn
} from '@fluentui/react-components';
import { 
  SignOut20Regular, 
  WeatherCloudy20Regular, 
  Person20Regular,
  Calendar20Regular
} from '@fluentui/react-icons';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { WeatherForecast } from '../types/auth';

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('20px'),
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('8px')
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px')
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    ...shorthands.gap('20px'),
    marginBottom: '24px'
  },
  card: {
    ...shorthands.padding('20px'),
    height: 'fit-content'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    marginBottom: '16px'
  },
  weatherGrid: {
    marginTop: '16px'
  },
  citiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px'
  },
  cityCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...shorthands.gap('4px'),
    ...shorthands.padding('12px'),
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.borderRadius('8px')
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.padding('40px')
  },
  dataSection: {
    marginTop: '24px'
  }
});

interface WeatherItem {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export const Dashboard: React.FC = () => {
  const classes = useStyles();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [weatherData, setWeatherData] = useState<WeatherForecast[]>([]);
  const [currentWeather, setCurrentWeather] = useState<WeatherForecast | null>(null);
  const [citiesWeather, setCitiesWeather] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [forecast, current, cities] = await Promise.all([
          authService.getWeatherForecast(),
          authService.getCurrentWeather(),
          authService.getCitiesWeather()
        ]);
        
        setWeatherData(forecast);
        setCurrentWeather(current);
        setCitiesWeather(cities);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const weatherColumns: TableColumnDefinition<WeatherItem>[] = [
    createTableColumn<WeatherItem>({
      columnId: 'date',
      compare: (a, b) => a.date.localeCompare(b.date),
      renderHeaderCell: () => 'Date',
      renderCell: (item) => new Date(item.date).toLocaleDateString()
    }),
    createTableColumn<WeatherItem>({
      columnId: 'temperature',
      compare: (a, b) => a.temperatureC - b.temperatureC,
      renderHeaderCell: () => 'Temperature',
      renderCell: (item) => `${item.temperatureC}°C / ${item.temperatureF}°F`
    }),
    createTableColumn<WeatherItem>({
      columnId: 'summary',
      compare: (a, b) => a.summary.localeCompare(b.summary),
      renderHeaderCell: () => 'Summary',
      renderCell: (item) => item.summary
    })
  ];

  if (isLoading) {
    return (
      <div className={classes.loadingContainer}>
        <Spinner size="large" label="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.userInfo}>
          <Person20Regular />
          <div>
            <Title2>Welcome, {user?.firstName} {user?.lastName}!</Title2>
            <span style={{ margin: '0 10px' }}></span>
            <Text>{user?.email}</Text>
          </div>
        </div>
        <Button
          appearance="subtle"
          icon={<SignOut20Regular />}
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </div>

      <div className={classes.grid}>
        <Card className={classes.card}>
          <div className={classes.cardHeader}>
            <Person20Regular />
            <Title1>Profile Information</Title1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Text><strong>Name:</strong> {user?.firstName} {user?.lastName}</Text>
            <Text><strong>Email:</strong> {user?.email}</Text>
            <Text><strong>Date of Birth:</strong> {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not specified'}</Text>
            <Text><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</Text>
          </div>
        </Card>

        <Card className={classes.card}>
          <div className={classes.cardHeader}>
            <WeatherCloudy20Regular />
            <Title1>Current Weather</Title1>
          </div>
          {currentWeather ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Text><strong>Date:</strong> {new Date(currentWeather.date).toLocaleDateString()}</Text>
              <Text><strong>Temperature:</strong> {currentWeather.temperatureC}°C / {currentWeather.temperatureF}°F</Text>
              <Text><strong>Condition:</strong> <Badge appearance="outline">{currentWeather.summary}</Badge></Text>
            </div>
          ) : (
            <Text>No current weather data available</Text>
          )}
        </Card>

        <Card className={classes.card}>
          <div className={classes.cardHeader}>
            <Calendar20Regular />
            <Title1>Quick Stats</Title1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Text><strong>Weather Forecasts:</strong> {weatherData.length} days</Text>
            <Text><strong>Cities Tracked:</strong> {citiesWeather.length}</Text>
            <Text><strong>Account Status:</strong> <Badge appearance="filled" color="success">Active</Badge></Text>
          </div>
        </Card>
      </div>

      <div className={classes.dataSection}>
        <Card className={classes.card}>
          <CardHeader
            header={
              <div className={classes.cardHeader}>
                <WeatherCloudy20Regular />
                <Title1>5-Day Weather Forecast</Title1>
              </div>
            }
          />
          <CardPreview>
            {weatherData.length > 0 ? (
              <DataGrid
                items={weatherData}
                columns={weatherColumns}
                sortable
                getRowId={(item) => item.date}
                className={classes.weatherGrid}
              >
                <DataGridHeader>
                  <DataGridRow>
                    {({ renderHeaderCell }) => (
                      <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                  </DataGridRow>
                </DataGridHeader>
                <DataGridBody<WeatherItem>>
                  {({ item, rowId }) => (
                    <DataGridRow<WeatherItem> key={rowId}>
                      {({ renderCell }) => (
                        <DataGridCell>{renderCell(item)}</DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            ) : (
              <Text>No weather forecast data available</Text>
            )}
          </CardPreview>
        </Card>
      </div>

      {citiesWeather.length > 0 && (
        <div className={classes.dataSection}>
          <Card className={classes.card}>
            <CardHeader
              header={
                <div className={classes.cardHeader}>
                  <WeatherCloudy20Regular />
                  <Title1>Cities Weather</Title1>
                </div>
              }
            />
            <CardPreview>
              <div className={classes.citiesGrid}>
                {citiesWeather.map((cityData, index) => (
                  <div key={index} className={classes.cityCard}>
                    <Subtitle1>{cityData.city}</Subtitle1>
                    <Text>{cityData.weather.temperatureC}°C / {cityData.weather.temperatureF}°F</Text>
                    <Badge appearance="outline">{cityData.weather.summary}</Badge>
                  </div>
                ))}
              </div>
            </CardPreview>
          </Card>
        </div>
      )}
    </div>
  );
}; 