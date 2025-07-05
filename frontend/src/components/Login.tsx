import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardPreview,
  Input,
  Button,
  Field,
  Text,
  Title1,
  MessageBar,
  MessageBarBody,
  Spinner,
  makeStyles,
  tokens,
  shorthands
} from '@fluentui/react-components';
import { Eye20Regular, EyeOff20Regular } from '@fluentui/react-icons';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest } from '../types/auth';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('20px')
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    ...shorthands.padding('32px'),
    ...shorthands.gap('20px')
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px')
  },
  footer: {
    textAlign: 'center',
    marginTop: '16px'
  },
  submitButton: {
    marginTop: '8px'
  }
});

export const Login: React.FC = () => {
  const classes = useStyles();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(formData);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <CardHeader
          header={
            <div className={classes.header}>
              <Title1>Welcome Back</Title1>
              <Text>Sign in to your account</Text>
            </div>
          }
        />
        
        <CardPreview>
          <form onSubmit={handleSubmit} className={classes.form}>
            {error && (
              <MessageBar intent="error">
                <MessageBarBody>{error}</MessageBarBody>
              </MessageBar>
            )}
            
            <Field label="Email" required>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </Field>
            
            <Field label="Password" required>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                contentAfter={
                  <Button
                    appearance="transparent"
                    icon={showPassword ? <EyeOff20Regular /> : <Eye20Regular />}
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  />
                }
              />
            </Field>
            
            <Button
              type="submit"
              appearance="primary"
              disabled={!isFormValid || isLoading}
              className={classes.submitButton}
              icon={isLoading ? <Spinner size="tiny" /> : undefined}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardPreview>
        
        <div className={classes.footer}>
          <Text>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: tokens.colorBrandForeground1 }}>
              Sign up
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}; 