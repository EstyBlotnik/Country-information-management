import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⚡️ The server is running at http://localhost:${PORT}`);
});
