const validateEnvironment = () => {
  const requiredVars = [
    'NODE_ENV',
    'PORT'
  ];

  const rdsVars = [
    'DB_HOST',
    'DB_NAME', 
    'DB_USER',
    'DB_PASSWORD'
  ];

  const cognitoVars = [
    'COGNITO_USER_POOL_ID',
    'COGNITO_CLIENT_ID',
    'AWS_REGION'
  ];

  const missingVars = [];

  // Check required vars
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Check RDS vars if using RDS
  if (process.env.DB_HOST && process.env.DB_HOST.includes('rds.amazonaws.com')) {
    rdsVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });
  }

  // Check Cognito vars
  cognitoVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnvironment; 