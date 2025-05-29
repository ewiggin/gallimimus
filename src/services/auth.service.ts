import { Injectable } from "../../gallimimus/decorators/index.ts";

@Injectable()
export class AuthService {
  getLoginUrl(): string {
    return "https://example.com/login";
  }
}
