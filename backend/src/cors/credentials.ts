import { allowedOrigins } from "./allowedOrigins";

const credentials = (req: any, res: any, next: any) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  }
  next();
}

export default credentials;
