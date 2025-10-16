# Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm deployment settings
   - Wait for deployment to complete

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "New Project"**

4. **Import your GitHub repository**

5. **Configure environment variables** (see Environment Setup below)

6. **Deploy**

## Environment Setup

### 1. Create Environment File

Copy the example environment file:
```bash
cp env.example .env
```

### 2. Configure Shopify Credentials

Edit `.env` with your actual Shopify store details:

```env
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token_here
SHOPIFY_API_VERSION=2024-01
DISCOUNT_CODE=RING_SIZE_100_OFF
NODE_ENV=production
```

### 3. Set Environment Variables in Vercel

After deployment, go to your Vercel project dashboard:

1. **Settings** → **Environment Variables**
2. **Add each variable** from your `.env` file
3. **Redeploy** if needed

## Shopify App Setup

### 1. Create Shopify App

1. Go to your **Shopify Admin** → **Apps** → **Develop apps**
2. Click **Create an app**
3. Give it a name (e.g., "Size Capture App")
4. Click **Create app**

### 2. Configure Admin API Access

1. Go to **Admin API access scopes**
2. Select these permissions:
   - `read_orders` - Read order information
   - `write_orders` - Create new orders
   - `read_products` - Read product/variant information
   - `write_price_rules` - Create discount codes
3. Click **Save**

### 3. Install App

1. Go to **API credentials**
2. Click **Install app**
3. Copy the **Admin API access token**

### 4. Update Environment Variables

Use the copied access token in your `.env` file and Vercel environment variables.

## Testing Your Deployment

### 1. Health Check

Test the health endpoint:
```bash
curl https://your-app.vercel.app/api/health
```

### 2. Test Order Capture

Test the main endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/capture-order \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "orderId": "1001",
    "variantId": "123456789"
  }'
```

### 3. Run Test Suite

```bash
npm test
```

## Integration with Shopify Storefront

### 1. Update API URL

In the example Liquid template (`examples/shopify-integration.liquid`), update:
```javascript
const API_BASE_URL = 'https://your-app.vercel.app';
```

### 2. Add to Your Theme

Copy the template code to your Shopify theme where you want the size capture form to appear.

### 3. Test Integration

1. Create a test order in your Shopify store
2. Use the form to capture size data
3. Verify the new order is created with the discount

## Monitoring and Maintenance

### 1. View Logs

- **Vercel Dashboard** → **Functions** → **View Logs**
- **Real-time logs** during development

### 2. Monitor Performance

- **Vercel Analytics** for API performance
- **Shopify Admin** for order creation success

### 3. Update Environment Variables

- **Vercel Dashboard** → **Settings** → **Environment Variables**
- **Redeploy** after changes

## Troubleshooting

### Common Issues

1. **"Shopify configuration missing"**
   - Check environment variables in Vercel
   - Verify `.env` file locally

2. **"Order not found"**
   - Ensure email matches exactly
   - Check order ID format
   - Verify order exists in Shopify

3. **"Failed to create order"**
   - Check Shopify API permissions
   - Verify variant ID exists
   - Check API rate limits

### Debug Mode

Set `NODE_ENV=development` to enable detailed logging in Vercel function logs.

## Security Considerations

- ✅ Environment variables are secure in Vercel
- ✅ CORS is properly configured
- ✅ Input validation is implemented
- ✅ Shopify API authentication is required

## Next Steps

After successful deployment:

1. **Test thoroughly** with real Shopify data
2. **Monitor logs** for any errors
3. **Customize** the discount code and order naming
4. **Integrate** with your Shopify theme
5. **Set up monitoring** and alerts

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Shopify API Documentation**: [shopify.dev/api](https://shopify.dev/api)
- **Function Logs**: Check Vercel dashboard for debugging