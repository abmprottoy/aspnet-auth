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
  shorthands,
  Subtitle2
} from '@fluentui/react-components';
import { Eye20Regular, EyeOff20Regular } from '@fluentui/react-icons';
import { useAuth } from '../contexts/AuthContext';
import { RegisterRequest } from '../types/auth';

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
    maxWidth: '500px',
    ...shorthands.padding('32px'),
    ...shorthands.gap('20px')
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px')
  },
  nameFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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

export const Register: React.FC = () => {
  const classes = useStyles();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Validate passwords match and length
    if (formData.password.length < 6) {
      setErrors(['Password must be at least 6 characters long']);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(['Passwords do not match']);
      setIsLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        if (response.errors && response.errors.length) {
          setErrors(response.errors);
        } else {
          setErrors([response.message || 'Registration failed']);
        }
      }
    } catch (error) {
      setErrors(['An unexpected error occurred']);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    formData.email &&
    formData.password.length >= 6 &&
    formData.confirmPassword &&
    formData.firstName &&
    formData.lastName &&
    formData.dateOfBirth;

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <CardHeader
          header={
            <div className={classes.header}>
              <Title1>Create Account</Title1>
              <br />
              <Subtitle2>Join us today</Subtitle2>
            </div>
          }
        />
        
        <CardPreview>
          <form onSubmit={handleSubmit} className={classes.form}>
            {errors.length > 0 && (
              <MessageBar intent="error">
                <MessageBarBody>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </MessageBarBody>
              </MessageBar>
            )}
            
            <div className={classes.nameFields}>
              <Field label="First Name" required>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  disabled={isLoading}
                />
              </Field>
              
              <Field label="Last Name" required>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  disabled={isLoading}
                />
              </Field>
            </div>
            
            <Field label="Email" required>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </Field>
            
            <Field label="Date of Birth" required>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={isLoading}
              />
            </Field>
            
            <Field label="Password" required>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a password"
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
            
            <Field label="Confirm Password" required>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                disabled={isLoading}
                contentAfter={
                  <Button
                    appearance="transparent"
                    icon={showConfirmPassword ? <EyeOff20Regular /> : <Eye20Regular />}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardPreview>
        
        <div className={classes.footer}>
          <Text>
            Already have an account?{' '}
            <Link to="/login" style={{ color: tokens.colorBrandForeground1 }}>
              Sign in
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}; 