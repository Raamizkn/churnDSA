import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

// Define API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Define customer data type
interface CustomerData {
  customer_id: string;
  customer_data: {
    gender: string;
    age: number;
    senior_citizen: boolean;
    married: boolean;
    dependents: boolean;
    tenure_months: number;
    contract: string;
    monthly_charge: number;
    total_charges: number;
    internet_service: string;
  };
  predictions: Array<{
    churn_probability: number;
    risk_segment: string;
    prediction_time: string;
    model_version: string;
    strategies: Array<{
      name: string;
      description: string | null;
      priority: number;
    }>;
  }>;
}

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Make API call to get customer data
        const response = await axios.get(`${API_URL}/customer/${id}`);
        setCustomerData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || 'Failed to fetch customer data.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('Error fetching customer data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  // Get the latest prediction
  const latestPrediction = customerData?.predictions?.[0];

  // Get risk color based on segment
  const getRiskColor = (segment: string) => {
    switch (segment) {
      case 'Low Risk':
        return 'success';
      case 'Medium-Low Risk':
        return 'info';
      case 'Medium Risk':
        return 'warning';
      case 'Medium-High Risk':
        return 'warning';
      case 'High Risk':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Customer Details
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : customerData ? (
        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Customer ID
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {customerData.customer_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Gender
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {customerData.customer_data.gender}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Age
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {customerData.customer_data.age}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Senior Citizen
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {customerData.customer_data.senior_citizen ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Married
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {customerData.customer_data.married ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Dependents
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {customerData.customer_data.dependents ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Service Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Service Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Tenure
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {customerData.customer_data.tenure_months} months
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Contract
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {customerData.customer_data.contract}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Internet Service
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {customerData.customer_data.internet_service}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Monthly Charge
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      ${customerData.customer_data.monthly_charge}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Total Charges
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      ${customerData.customer_data.total_charges}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Latest Prediction */}
          {latestPrediction && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Latest Churn Prediction
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Churn Probability
                      </Typography>
                      <Typography variant="h5" gutterBottom>
                        {(latestPrediction.churn_probability * 100).toFixed(2)}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Risk Segment
                      </Typography>
                      <Chip
                        label={latestPrediction.risk_segment}
                        color={getRiskColor(latestPrediction.risk_segment) as any}
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Prediction Time
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {new Date(latestPrediction.prediction_time).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Retention Strategies */}
          {latestPrediction && latestPrediction.strategies.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommended Retention Strategies
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {latestPrediction.strategies.map((strategy) => (
                      <ListItem key={strategy.name}>
                        <ListItemText
                          primary={`${strategy.priority}. ${strategy.name}`}
                          secondary={strategy.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Prediction History */}
          {customerData.predictions.length > 1 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Prediction History
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Churn Probability</TableCell>
                          <TableCell>Risk Segment</TableCell>
                          <TableCell>Model Version</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {customerData.predictions.map((prediction, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {new Date(prediction.prediction_time).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {(prediction.churn_probability * 100).toFixed(2)}%
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={prediction.risk_segment}
                                color={getRiskColor(prediction.risk_segment) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{prediction.model_version}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      ) : (
        <Alert severity="info">No customer data found.</Alert>
      )}
    </Box>
  );
};

export default CustomerDetails; 