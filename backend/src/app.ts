import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuthService } from "./services/authService.js";
import { AuthRoute } from "./routes/auth.js";
import { AuthController } from "./controllers/auth.controller.js";
import { RepoFactory } from "./factory/RepoFactory.js";

dotenv.config();

class App {
  private readonly app: Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT ?? "3000");

    this.app.use(cors());
    this.app.use(express.json());

    this.init();
  }

  private initRoutes() {
    const { authService } = this.initServices();
    const authController = new AuthController(authService);
    const authRoute = new AuthRoute(authController);

    this.app.use("/auth", authRoute.router);
  }

  private initServices() {
    const { userRepo } = this.initRepo();
    const authService = new AuthService(userRepo);
    return { authService };
  }

  private initRepo() {
    const factory = new RepoFactory();
    const repoType = process.env.REPO_TYPE ?? "prisma";
    const userRepo = factory.getUserRepo(repoType);
    return { userRepo };
  }

  private init() {
    this.initRoutes();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at port: ${this.port}`);
    });
  }
}

export default App;
