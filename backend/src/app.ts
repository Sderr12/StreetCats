import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuthService } from "./services/authService.js";
import { AuthRoute } from "./routes/auth.js";
import { AuthController } from "./controllers/auth.controller.js";
import { RepoFactory } from "./factory/RepoFactory.js";
import path from "path";
import { CatService } from "./services/cat.service.js";
import { CatController } from "./controllers/cat.controller.js";
import { CatRoute } from "./routes/cat.route.js";
import { CommentController } from "./controllers/comment.controller.js";
import { CommentService } from "./services/comment.service.js";
import { CommentRoute } from "./routes/comment.route.js";


dotenv.config();

class App {
  private readonly app: Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT ?? "3000");

    this.app.use(cors());
    this.app.use(express.json());

    const uploadsPath = path.join(process.cwd(), "uploads");

    this.app.use("/uploads", express.static(uploadsPath));
    this.init();
  }

  private initRoutes() {
    const { authService, catService, commentService } = this.initServices();
    const authController = new AuthController(authService);
    const catController = new CatController(catService);
    const commentController = new CommentController(commentService);
    const authRoute = new AuthRoute(authController);
    const catRoute = new CatRoute(catController);
    const commentRoute = new CommentRoute(commentController);


    this.app.use("/auth", authRoute.router);
    this.app.use("/cats", catRoute.router);
    this.app.use("/cats", commentRoute.router)
  }

  private initServices() {
    const { userRepo, catRepo, commentRepo } = this.initRepo();
    const authService = new AuthService(userRepo);
    const catService = new CatService(catRepo);
    const commentService = new CommentService(commentRepo);
    return { authService, catService, commentService };
  }

  private initRepo() {
    const factory = new RepoFactory();
    const repoType = process.env.REPO_TYPE ?? "Prisma";
    const userRepo = factory.getUserRepo(repoType);
    const catRepo = factory.getCatRepo(repoType);
    const commentRepo = factory.getCommentRepo(repoType);
    return { userRepo, catRepo, commentRepo };
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
