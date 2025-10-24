import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    minWidth: '600px',
  },
}));

const StatusButton = styled(Button)(({ status }) => ({
  borderRadius: '20px',
  padding: '6px 16px',
  fontSize: '0.875rem',
  textTransform: 'capitalize',
  backgroundColor: 
    status === 'Processing' ? '#fff7e6' :
    status === 'Dispatched' ? '#e6f7ff' : '#f5f5f5',
  color: 
    status === 'Processing' ? '#ffa500' :
    status === 'Dispatched' ? '#1890ff' : '#666666',
  '&:hover': {
    backgroundColor: 
      status === 'Processing' ? '#fff0cc' :
      status === 'Dispatched' ? '#bae7ff' : '#e6e6e6',
  },
}));

const OrderDetailModal = ({ open, onClose, order, onStatusChange }) => {
  const handleStatusChange = (event) => {
    onStatusChange(order._id, event.target.value);
  };

  if (!order) return null;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Order Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ padding: '24px' }}>
        <Box sx={{ display: 'grid', gap: '24px' }}>
          {/* Order Info */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Order Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Box>
                <Typography color="textSecondary" variant="body2">Order ID</Typography>
                <Typography variant="body1">{order._id}</Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body2">Payment ID</Typography>
                <Typography variant="body1">{order.paymentId}</Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body2">Order Date</Typography>
                <Typography variant="body1">
                  {new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body2">Total Amount</Typography>
                <Typography variant="body1">₹{order.amount}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Customer Info */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Customer Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Box>
                <Typography color="textSecondary" variant="body2">Name</Typography>
                <Typography variant="body1">{order.customer}</Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body2">Phone</Typography>
                <Typography variant="body1">{order.phone}</Typography>
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography color="textSecondary" variant="body2">Address</Typography>
                <Typography variant="body1">{order.address}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Products */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Products
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {order.products.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px'
                  }}
                >
                  <img
                    src={product.product?.images?.[0] || '/placeholder-image.jpg'}
                    alt={product.name}
                    style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{product.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Quantity: {product.quantity} × ₹{product.price}
                    </Typography>
                    {/* Tracking info (if available) */}
                    {product.trackingInfo?.trackingNumber && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          Tracking: {product.trackingInfo.trackingNumber} • {product.trackingInfo.courier || ''}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              const trackUrl = import.meta.env.VITE_DELIVERY_TRACK_URL || `https://track.example.com/${product.trackingInfo.trackingNumber}`;
                              window.open(trackUrl, '_blank');
                            }}
                            sx={{ ml: 0 }}
                          >
                            Track Order
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      ₹{product.quantity * product.price}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Status Update */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Order Status
              </Typography>
              <StatusButton status={order.status} variant="contained" disableElevation>
                {order.status}
              </StatusButton>
            </Box>
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={order.status}
                onChange={handleStatusChange}
                size="small"
                disabled={order.status === 'Dispatched'} // Disable after dispatch
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#20BFA5',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1aa38f',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#20BFA5',
                  },
                }}
              >
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Dispatched">Dispatched</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default OrderDetailModal;