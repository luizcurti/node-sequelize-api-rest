import app from './app';

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📚 Access the API at http://localhost:${port}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});
