import express from "express";
import type { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";


class App {
  private readonly app: Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT ?? "3000");

    this.app.use(cors());
    this.app.use(express.json());


  }



  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at port: ${this.port}`);
    });
  }
}

export default App;

