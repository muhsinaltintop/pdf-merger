// next.config.js
module.exports = {
    api: {
      bodyParser: false, // required when using formidable
      externalResolver: true,
    },
    serverActions: {
      bodySizeLimit: '10mb', // <-- increase this limit as needed
    },
  };
  