import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private storageKey = 'userRole';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setRole(role: string) {
    if (this.isBrowser) {
      sessionStorage.setItem(this.storageKey, role);
    }
  }

  getRole(): string {
    if (this.isBrowser) {
      return sessionStorage.getItem(this.storageKey) || '';
    }
    return '';
  }

  clearRole() {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.storageKey);
    }
  }
}
