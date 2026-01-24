import type { AuthService } from "../services/authService.js";
import { TokenService } from "../services/tokenService.js";
import type { Request, Response } from "express";

export class AuthController {
  private readonly authService: AuthService;
  private readonly tokenService: TokenService;

  constructor(authService: AuthService) {
    this.tokenService = new TokenService(process.env.JWT_SECRET!, process.env.JWT_DURATION ?? "30m");
    this.authService = authService;
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      const protocol = req.protocol; // http o https
      const host = req.get('host'); // localhost:3000

      const avatarUrl = req.file
        ? `${protocol}://${host}/uploads/${req.file.filename}`
        : undefined;

      if (!username || !email || !password) {
        res.status(400).json({ message: "Username, email and password are required!" });
        return;
      }

      const user = await this.authService.register(
        { username, email, password },
        avatarUrl // Ora salviamo http://localhost:3000/uploads/123.jpg
      );

      const token = this.tokenService.generateToken({ userId: user.id });
      res.status(201).json({ token, user });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration error" });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required!" });
        return;
      }

      const user = await this.authService.login(email, password);

      // NOTA PER IL SUPREMO LEADER: 
      // Se nel DB avete già dei vecchi utenti salvati solo con "/uploads/...", 
      // il login continuerà a mandarli così. Dovreste aggiornare il DB 
      // o fare la stessa logica di concatenazione anche qui se user.avatarUrl non inizia con "http".

      const token = this.tokenService.generateToken({ userId: user.id });
      res.json({ token, user });
    } catch (error: any) {
      res.status(401).json({ message: error.message || "Login's error" });
    }
  }
}
