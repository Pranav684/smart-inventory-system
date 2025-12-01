require("dotenv").config();
const http = require("http");
const app = require("./src/app");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

try {
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
} catch (error) {
  console.log(".env is not included");
}
