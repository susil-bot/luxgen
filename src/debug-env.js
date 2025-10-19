// Debug environment variables
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
