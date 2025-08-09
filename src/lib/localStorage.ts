// lib/localStorage.ts
export interface UserPreferences {
  email?: string;
  rememberMe?: boolean;
  theme?: 'dark' | 'light';
  lastVisited?: string;
}

export class LocalStorageManager {
  private static readonly USER_PREFS_KEY = 'license_manager_user_prefs';
  private static readonly SESSION_KEY = 'license_manager_session';

  // Save user preferences to localStorage
  static saveUserPreferences(prefs: Partial<UserPreferences>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const existing = this.getUserPreferences();
      const updated = { ...existing, ...prefs };
      localStorage.setItem(this.USER_PREFS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  // Get user preferences from localStorage
  static getUserPreferences(): UserPreferences {
    if (typeof window === 'undefined') return {};
    
    try {
      const stored = localStorage.getItem(this.USER_PREFS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      return {};
    }
  }

  // Remember login email for "Remember Me" functionality
  static rememberLoginEmail(email: string): void {
    this.saveUserPreferences({ email, rememberMe: true });
  }

  // Clear remembered login email
  static clearRememberedEmail(): void {
    this.saveUserPreferences({ email: undefined, rememberMe: false });
  }

  // Get remembered email
  static getRememberedEmail(): string | null {
    const prefs = this.getUserPreferences();
    return prefs.rememberMe ? prefs.email || null : null;
  }

  // Save session metadata (non-sensitive data)
  static saveSessionMetadata(data: { loginTime?: Date; lastActivity?: Date }): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({
        ...data,
        loginTime: data.loginTime?.toISOString(),
        lastActivity: data.lastActivity?.toISOString(),
      }));
    } catch (error) {
      console.error('Failed to save session metadata:', error);
    }
  }

  // Get session metadata
  static getSessionMetadata(): { loginTime?: Date; lastActivity?: Date } | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      return {
        loginTime: parsed.loginTime ? new Date(parsed.loginTime) : undefined,
        lastActivity: parsed.lastActivity ? new Date(parsed.lastActivity) : undefined,
      };
    } catch (error) {
      console.error('Failed to load session metadata:', error);
      return null;
    }
  }

  // Clear all stored data
  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.USER_PREFS_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Update last activity timestamp
  static updateLastActivity(): void {
    this.saveSessionMetadata({ lastActivity: new Date() });
  }
}
