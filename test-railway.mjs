import https from "https";

const url = "https://adoption-system-production.up.railway.app/api/health";

console.log("Testing:", url);
const start = Date.now();

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("Response:", res.statusCode, data);
    console.log("Time:", Date.now() - start, "ms");
  });
}).on("error", (err) => {
  console.error("Error:", err.message);
  console.log("Time:", Date.now() - start, "ms");
});
