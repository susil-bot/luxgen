# MongoDB Setup Guide for Trainer Platform

## 🚀 Quick Start

### Prerequisites
- MongoDB Atlas account
- Node.js installed
- Access to your MongoDB cluster

### Step 1: Configure Environment Variables

1. **Update your `.env` file** in the backend directory:
```bash
cd trainer-platform/backend
```

2. **Set the MongoDB connection string**:
```bash
# Replace <your_actual_password> with your real MongoDB password
MONGODB_URL=mongodb+srv://sobhanasusil064:<your_actual_password>@luxgen-ecommerce.bgrskvi.mongodb.net/trainer_platform?retryWrites=true&w=majority
```

### Step 2: Run the Database Setup Script

```bash
# Navigate to the backend directory
cd trainer-platform/backend

# Run the MongoDB setup script
node scripts/setup-mongodb.js
```

This script will:
- ✅ Connect to your MongoDB cluster
- ✅ Create all required collections
- ✅ Set up proper indexes for performance
- ✅ Create sample data for testing
- ✅ Display collection statistics

### Step 3: Verify the Setup

After running the setup script, you should see:
```
✅ MongoDB setup completed successfully!

📊 Sample Data Summary:
   - Tenant: Sample Training Organization (sample-org)
   - User: John Doe (john.doe@sample-org.com)
   - Poll: Training Effectiveness Survey
   - User Details: Extended profile for John
   - Tenant Schema: Styling configuration created
```

### Step 4: Test Your Application

```bash
# Start the backend server
npm start
```

The server should now connect successfully to MongoDB and you should see:
```
✅ MongoDB: Connected
```

## 📊 Database Collections Created

The setup script creates the following collections:

1. **`tenants`** - Multi-tenant organizations
2. **`users`** - User accounts and authentication
3. **`userdetails`** - Extended user profiles
4. **`userregistrations`** - Registration process management
5. **`polls`** - Polling and feedback system
6. **`tenantschemas`** - Styling and branding configuration

## 🔍 Indexes Created

### Performance Indexes:
- **Compound indexes** for multi-field queries
- **Unique indexes** for data integrity
- **Text indexes** for search functionality
- **TTL indexes** for data expiration

### Key Indexes:
- `{ tenantId: 1, email: 1 }` - User lookup by tenant and email
- `{ slug: 1 }` - Tenant lookup by slug
- `{ status: 1 }` - Filter by status
- `{ createdAt: -1 }` - Sort by creation date

## 🧪 Sample Data

The setup creates sample data including:
- **Sample Tenant**: "Sample Training Organization"
- **Sample User**: John Doe (admin@sample-org.com)
- **Sample Poll**: Training Effectiveness Survey
- **Sample User Details**: Extended profile with skills and experience
- **Sample Tenant Schema**: Styling configuration

## 🔧 Troubleshooting

### Connection Issues
```bash
# Check if MongoDB URL is correct
echo $MONGODB_URL

# Test connection manually
node test-mongodb.js
```

### Permission Issues
- Ensure your MongoDB user has read/write permissions
- Check network access settings in MongoDB Atlas
- Verify IP whitelist if configured

### Index Creation Issues
- Indexes are created with error handling
- Existing indexes won't be recreated
- Check MongoDB Atlas logs for detailed errors

## 📈 Monitoring

### Check Collection Statistics
```bash
# Run the setup script to see stats
node scripts/setup-mongodb.js
```

### Monitor Performance
- Use MongoDB Atlas dashboard
- Check query performance
- Monitor connection pool usage

## 🔒 Security Best Practices

1. **Use Strong Passwords**
2. **Enable Network Access Control**
3. **Use VPC Peering for production**
4. **Enable Audit Logging**
5. **Regular Security Updates**

## 📚 Next Steps

1. **Review the Database Architecture**: Check `DATABASE_ARCHITECTURE.md`
2. **Explore the Mindmap**: View `DATABASE_MINDMAP.md`
3. **Test API Endpoints**: Use the test scripts
4. **Monitor Performance**: Set up alerts in MongoDB Atlas
5. **Scale as Needed**: Upgrade cluster tier when required

## 🆘 Support

If you encounter issues:
1. Check MongoDB Atlas logs
2. Verify connection string format
3. Test with MongoDB Compass
4. Review error messages in the setup script

---

**🎉 Congratulations!** Your MongoDB database is now set up and ready for the Trainer Platform. 