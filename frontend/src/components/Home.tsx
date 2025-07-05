import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardPreview,
  Button,
  Text,
  Title1,
  Title2,
  makeStyles,
  tokens,
  shorthands
} from '@fluentui/react-components';
import { Person20Regular, Shield20Regular } from '@fluentui/react-icons';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('20px')
  },
  hero: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    ...shorthands.padding('32px'),
    textAlign: 'center'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    ...shorthands.gap('20px'),
    marginTop: '32px',
    marginBottom: '32px'
  },
  featureCard: {
    ...shorthands.padding('20px'),
    textAlign: 'center'
  },
  actions: {
    display: 'flex',
    ...shorthands.gap('16px'),
    justifyContent: 'center',
    marginTop: '24px'
  }
});

export const Home: React.FC = () => {
  const classes = useStyles();
  const { isAuthenticated } = useAuth();

  return (
    <div className={classes.container}>
      <div className={classes.hero}>
        <Title1 as="h1">ASP.NET Core Authentication Demo</Title1>
        <br />
        <Text size={500}>
          A complete authentication system with JWT tokens and HTTP-only cookies
        </Text>
      </div>

      <Card className={classes.card}>
        <CardHeader
          header={
            <Title2>Welcome to the Demo Application</Title2>
          }
        />

        <CardPreview>
          <Text>
            This application demonstrates a complete authentication system built with:
          </Text>
          
          <div className={classes.features}>
            <Card className={classes.featureCard}>
              <Shield20Regular style={{ fontSize: '32px', marginBottom: '8px' }} />
              <Title2>Secure Backend</Title2>
              <Text>ASP.NET Core with Identity and JWT authentication</Text>
            </Card>
            
            <div style={{ margin: '10px 0' }}></div>
            <Card className={classes.featureCard}>
              <Person20Regular style={{ fontSize: '32px', marginBottom: '8px' }} />
              <Title2>Modern Frontend</Title2>
              <Text>React TypeScript with Fluent UI v2 components</Text>
            </Card>
          </div>
          
          <Text>
            The application features user registration, login, secure API endpoints, 
            and HTTP-only cookie-based authentication for enhanced security.
          </Text>
          
          <div className={classes.actions}>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button appearance="primary" size="large">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button appearance="primary" size="large">
                    Sign In
                  </Button>
                </Link>
                <span style={{ margin: '0 10px' }}></span>
                <Link to="/register">
                  <Button appearance="secondary" size="large">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardPreview>
      </Card>
    </div>
  );
}; 