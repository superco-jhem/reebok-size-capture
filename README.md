# Reebok Size Capture App

A serverless Node.js application deployed on Vercel that integrates with Shopify to capture order data and create discounted ring-size orders.

## Features

- **Order Validation**: Verifies existing orders by email and order ID
- **Automatic Discount**: Applies 100% discount to ring-size orders
- **Order Linking**: Creates new orders with "-ring-size" suffix
- **Shopify Integration**: Full Shopify Admin API integration
- **Serverless**: Deployed on Vercel for scalability

## Prerequisites

- Node.js 18+ installed
- Vercel CLI installed (`npm i -g vercel`)
- Shopify store with Admin API access
- Shopify access token with appropriate permissions

## Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd reebok-size-capture-app
npm install
```

### 2. Environment Configuration

Copy the environment example file and configure your Shopify credentials:

```bash
cp env.example .env
```

Edit `.env` with your Shopify store details:

```env
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token_here
SHOPIFY_API_VERSION=2024-01
DISCOUNT_CODE=RING_SIZE_100_OFF
NODE_ENV=development
```

### 3. Shopify Access Token Setup

1. Go to your Shopify Admin → Apps → Develop apps
2. Create a new app or use existing one
3. Configure Admin API access with these permissions:
   - `read_orders` - Read order information
   - `write_orders` - Create new orders
   - `read_products` - Read product/variant information
   - `write_price_rules` - Create discount codes
4. Install the app and copy the access token

### 4. Deploy to Vercel

```bash
# Login to Vercel (first time only)
vercel login

# Deploy
vercel --prod
```

## API Endpoints

### POST `/api/capture-order`

Captures order data and creates a discounted ring-size order.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "orderId": "1001",
  "variantId": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ring-size order created successfully",
  "data": {
    "originalOrder": "#1001",
    "newOrder": "#1001-ring-size",
    "discountApplied": true
  }
}
```

### GET `/api/health`

Health check endpoint to verify app status and configuration.

## Usage Examples

### Frontend Integration

```javascript
// Example frontend code to call the API
async function captureOrder(email, orderId, variantId) {
  try {
    const response = await fetch('/api/capture-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        orderId,
        variantId
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Ring-size order created:', result.data.newOrder);
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Usage
captureOrder('customer@example.com', '1001', '123456789');
```

### Shopify Liquid Template

```liquid
<!-- Example Shopify storefront integration -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  const captureButton = document.getElementById('capture-size');

  captureButton.addEventListener('click', function() {
    const email = '{{ customer.email }}';
    const orderId = '{{ order.name }}';
    const variantId = '{{ product.selected_or_first_available_variant.id }}';

    captureOrder(email, orderId, variantId);
  });
});
</script>
```

## How It Works

1. **Data Capture**: Receives email, order ID, and variant ID from storefront
2. **Order Validation**: Searches Shopify for existing order with matching email and order ID
3. **Discount Creation**: Automatically creates a 100% discount code if it doesn't exist
4. **New Order Creation**: Creates a new order with the specified variant
5. **Order Naming**: Applies "-ring-size" suffix to the original order name
6. **Discount Application**: Applies the 100% discount to make the order free

## Error Handling

The app includes comprehensive error handling for:
- Missing or invalid input data
- Shopify API errors
- Order not found scenarios
- Authentication failures
- Network issues

## Monitoring

- **Health Check**: Use `/api/health` to monitor app status
- **Logs**: Check Vercel function logs for debugging
- **Metrics**: Monitor API response times and success rates

## Security Considerations

- CORS enabled for cross-origin requests
- Input validation and sanitization
- Environment variable protection
- Shopify API authentication
- Rate limiting (handled by Vercel)

## Troubleshooting

### Common Issues

1. **"Shopify configuration missing"**
   - Check your `.env` file and environment variables
   - Verify Shopify access token permissions

2. **"Order not found"**
   - Ensure the email matches the order exactly
   - Check if the order ID format is correct
   - Verify the order exists in your Shopify store

3. **"Failed to create ring-size order"**
   - Check Shopify API rate limits
   - Verify variant ID exists and is active
   - Ensure sufficient API permissions

### Debug Mode

Set `NODE_ENV=development` in your environment to enable detailed logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Shopify API documentation
3. Check Vercel deployment logs
4. Open an issue in the repository