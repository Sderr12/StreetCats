import { Router } from "express"

export abstract class Route {
  public readonly router: Router;

  constructor() {
    this.router = Router();
  }

  protected abstract initRoute() : void;
}
