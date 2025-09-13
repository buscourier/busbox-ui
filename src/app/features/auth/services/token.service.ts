import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = '';

  setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();

    if (!token) {
      return false;
    }

    return true;

    // try {
    //   const decodedToken = this.decodeToken(token);
    //   const expirationDate = new Date(decodedToken.exp * 1000);
    //   return expirationDate > new Date();
    // } catch (error) {
    //   console.error('Error decoding token:', error);
    //   return false;
    // }
  }

  // getUserFromToken(): AuthResponse | null {
  //   const token = this.getAccessToken();
  //
  //   if (!token) {
  //     return null;
  //   }
  //
  //   // if (payload.exp * 1000 < Date.now()) {
  //   //   this.clearTokens(); // Удаляем истекший токен
  //   //   return null;
  //   // }
  //
  //   try {
  //     const payload = this.decodeToken(token);
  //     console.log('payload', payload);
  //     return payload;
  //   } catch (error) {
  //     console.error('Error decoding JWT token:', error);
  //     return null;
  //   }
  // }

  getTokenExpirationTime(): number | null {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      const decodedToken = this.decodeToken(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      const now = new Date();
      return expirationDate.getTime() - now.getTime();
    } catch (error) {
      console.error('Error getting token expiration time:', error);
      return null;
    }
  }

  private decodeToken(token: string): { exp: number } {
    return jwtDecode(token);
  }
}
