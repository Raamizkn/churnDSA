import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Alert,
} from '@mui/material';
import axios from 'axios';

// Define API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Define form field types
interface FormData {
  customer_id: string;
  gender: string;
  age: string;
  senior_citizen: string;
  married: string;
  dependents: string;
  tenure_months: string;
  phone_service: string;
  multiple_lines: string;
  internet_service: string;
  online_security: string;
  online_backup: string;
  device_protection: string;
  tech_support: string;
  streaming_tv: string;
  streaming_movies: string;
  streaming_music: string;
  unlimited_data: string;
  contract: string;
  paperless_billing: string;
  payment_method: string;
  monthly_charge: string;
  total_charges: string;
  satisfaction_score: string;
}

// Define prediction result type
interface PredictionResult {
  customer_id: string;
  prediction: {
    churn_probability: number;
    churn_probability_percent: string;
    risk_segment: string;
    prediction_time: string;
    model_version: string;
  };
  retention_strategies: Array<{
    name: string;
    priority: number;
  }>;
  customer_data: {
    gender: string;
    age: number;
    tenure_months: number;
    contract: string;
    monthly_charge: number;
    internet_service: string;
  };
}

const PredictionForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<FormData>({
    customer_id: '',
    gender: '',
    age: '',
    senior_citizen: 'No',
    married: 'No',
    dependents: 'No',
    tenure_months: '',
    phone_service: 'Yes',
    multiple_lines: 'No',
    internet_service: '',
    online_security: 'No',
    online_backup: 'No',
    device_protection: 'No',
    tech_support: 'No',
    streaming_tv: 'No',
    streaming_movies: 'No',
    streaming_music: 'No',
    unlimited_data: 'No',
    contract: '',
    paperless_billing: 'No',
    payment_method: '',
    monthly_charge: '',
    total_charges: '',
    satisfaction_score: '',
  });

  // Define steps for the form
  const steps = ['Customer Information', 'Service Details', 'Billing Information'];

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert string values to appropriate types
      const payload = {
        customer_id: formData.customer_id,
        gender: formData.gender,
        age: parseInt(formData.age),
        senior_citizen: formData.senior_citizen === 'Yes',
        married: formData.married === 'Yes',
        dependents: formData.dependents === 'Yes',
        tenure_months: parseInt(formData.tenure_months),
        phone_service: formData.phone_service === 'Yes',
        multiple_lines: formData.multiple_lines === 'Yes',
        internet_service: formData.internet_service,
        online_security: formData.online_security === 'Yes',
        online_backup: formData.online_backup === 'Yes',
        device_protection: formData.device_protection === 'Yes',
        tech_support: formData.tech_support === 'Yes',
        streaming_tv: formData.streaming_tv === 'Yes',
        streaming_movies: formData.streaming_movies === 'Yes',
        streaming_music: formData.streaming_music === 'Yes',
        unlimited_data: formData.unlimited_data === 'Yes',
        contract: formData.contract,
        paperless_billing: formData.paperless_billing === 'Yes',
        payment_method: formData.payment_method,
        monthly_charge: parseFloat(formData.monthly_charge),
        total_charges: formData.total_charges ? parseFloat(formData.total_charges) : undefined,
        satisfaction_score: formData.satisfaction_score ? parseInt(formData.satisfaction_score) : undefined,
      };

      // Make API call to predict endpoint
      const response = await axios.post(`${API_URL}/predict`, payload);
      setPredictionResult(response.data);
      handleNext();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An error occurred during prediction.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render form step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Customer ID"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Senior Citizen</InputLabel>
                <Select
                  name="senior_citizen"
                  value={formData.senior_citizen}
                  onChange={handleChange}
                  label="Senior Citizen"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Married</InputLabel>
                <Select
                  name="married"
                  value={formData.married}
                  onChange={handleChange}
                  label="Married"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Dependents</InputLabel>
                <Select
                  name="dependents"
                  value={formData.dependents}
                  onChange={handleChange}
                  label="Dependents"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Tenure (Months)"
                name="tenure_months"
                type="number"
                value={formData.tenure_months}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Phone Service</InputLabel>
                <Select
                  name="phone_service"
                  value={formData.phone_service}
                  onChange={handleChange}
                  label="Phone Service"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Multiple Lines</InputLabel>
                <Select
                  name="multiple_lines"
                  value={formData.multiple_lines}
                  onChange={handleChange}
                  label="Multiple Lines"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Internet Service</InputLabel>
                <Select
                  name="internet_service"
                  value={formData.internet_service}
                  onChange={handleChange}
                  label="Internet Service"
                >
                  <MenuItem value="DSL">DSL</MenuItem>
                  <MenuItem value="Fiber Optic">Fiber Optic</MenuItem>
                  <MenuItem value="Cable">Cable</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Online Security</InputLabel>
                <Select
                  name="online_security"
                  value={formData.online_security}
                  onChange={handleChange}
                  label="Online Security"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Online Backup</InputLabel>
                <Select
                  name="online_backup"
                  value={formData.online_backup}
                  onChange={handleChange}
                  label="Online Backup"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Device Protection</InputLabel>
                <Select
                  name="device_protection"
                  value={formData.device_protection}
                  onChange={handleChange}
                  label="Device Protection"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tech Support</InputLabel>
                <Select
                  name="tech_support"
                  value={formData.tech_support}
                  onChange={handleChange}
                  label="Tech Support"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Streaming TV</InputLabel>
                <Select
                  name="streaming_tv"
                  value={formData.streaming_tv}
                  onChange={handleChange}
                  label="Streaming TV"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Streaming Movies</InputLabel>
                <Select
                  name="streaming_movies"
                  value={formData.streaming_movies}
                  onChange={handleChange}
                  label="Streaming Movies"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Contract</InputLabel>
                <Select
                  name="contract"
                  value={formData.contract}
                  onChange={handleChange}
                  label="Contract"
                >
                  <MenuItem value="Month-to-Month">Month-to-Month</MenuItem>
                  <MenuItem value="One Year">One Year</MenuItem>
                  <MenuItem value="Two Year">Two Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Paperless Billing</InputLabel>
                <Select
                  name="paperless_billing"
                  value={formData.paperless_billing}
                  onChange={handleChange}
                  label="Paperless Billing"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  label="Payment Method"
                >
                  <MenuItem value="Bank Withdrawal">Bank Withdrawal</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Mailed Check">Mailed Check</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Monthly Charge"
                name="monthly_charge"
                type="number"
                value={formData.monthly_charge}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Charges"
                name="total_charges"
                type="number"
                value={formData.total_charges}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Satisfaction Score (1-5)"
                name="satisfaction_score"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={formData.satisfaction_score}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            {predictionResult && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert
                    severity={
                      predictionResult.prediction.churn_probability < 0.4
                        ? 'success'
                        : predictionResult.prediction.churn_probability < 0.7
                        ? 'warning'
                        : 'error'
                    }
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="h6">
                      Churn Probability: {predictionResult.prediction.churn_probability_percent}
                    </Typography>
                    <Typography>Risk Segment: {predictionResult.prediction.risk_segment}</Typography>
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Recommended Retention Strategies
                  </Typography>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        {predictionResult.retention_strategies.map((strategy) => (
                          <Grid item xs={12} key={strategy.name}>
                            <Typography variant="body1">
                              {strategy.priority}. {strategy.name}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Customer ID
                          </Typography>
                          <Typography variant="body1">{predictionResult.customer_id}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Gender
                          </Typography>
                          <Typography variant="body1">
                            {predictionResult.customer_data.gender}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Age
                          </Typography>
                          <Typography variant="body1">{predictionResult.customer_data.age}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Tenure (Months)
                          </Typography>
                          <Typography variant="body1">
                            {predictionResult.customer_data.tenure_months}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Contract
                          </Typography>
                          <Typography variant="body1">
                            {predictionResult.customer_data.contract}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Monthly Charge
                          </Typography>
                          <Typography variant="body1">
                            ${predictionResult.customer_data.monthly_charge}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Churn Prediction
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
        <Step>
          <StepLabel>Results</StepLabel>
        </Step>
      </Stepper>

      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0 || activeStep === 3}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                  >
                    Return to Dashboard
                  </Button>
                ) : activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    {loading ? 'Predicting...' : 'Predict Churn'}
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PredictionForm; 