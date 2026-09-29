export interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  password?: string;
  role: 'entrepreneur' | 'fpo_manager' | 'institutional_buyer' | 'bank_officer';
  roleLabel: string;
  state: string;
  district: string;
  location: string;
  marginCapital?: number;
  registeredAt: string;
}

const STORAGE_KEY = 'AGRIXORA_REGISTERED_USERS_DB';
const SESSION_KEY = 'AGRIXORA_AUTH_SESSION_USER';

export const ROLE_LABELS: Record<string, string> = {
  entrepreneur: 'Rural Entrepreneur / Beneficiary',
  fpo_manager: 'FPO / SHG Federation Leader',
  institutional_buyer: 'Institutional Off-taker',
  bank_officer: 'Lead District Bank Officer'
};

/**
 * Retrieve all registered users from local persistent database.
 * Default is an empty array (NO demo accounts).
 */
export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading registered users DB', e);
    return [];
  }
}

/**
 * Register a new user into the database.
 */
export function registerUser(data: {
  name: string;
  phone: string;
  password?: string;
  role: 'entrepreneur' | 'fpo_manager' | 'institutional_buyer' | 'bank_officer';
  state: string;
  district: string;
  marginCapital?: number;
}): { success: boolean; message: string; user?: RegisteredUser } {
  const cleanPhone = data.phone.trim().replace(/\D/g, '');
  const cleanName = data.name.trim();

  if (!cleanName || cleanName.length < 2) {
    return { success: false, message: 'Please enter a valid full name or enterprise name.' };
  }

  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
  }

  const users = getRegisteredUsers();
  const existing = users.find(u => u.phone === cleanPhone);
  if (existing) {
    return { 
      success: false, 
      message: `An account is already registered with mobile +91 ${cleanPhone}. Please switch to "Sign In" tab.` 
    };
  }

  const newUser: RegisteredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    phone: cleanPhone,
    password: data.password || '123456',
    role: data.role,
    roleLabel: ROLE_LABELS[data.role] || 'Rural Entrepreneur',
    state: data.state,
    district: data.district,
    location: `${data.district}, ${data.state}`,
    marginCapital: data.marginCapital || 25000,
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  } catch (e) {
    console.error('Failed to save user', e);
  }

  return { 
    success: true, 
    message: `Account registered successfully! Welcome, ${newUser.name}.`,
    user: newUser
  };
}

/**
 * Authenticate an existing registered user.
 * Rejects if the user is not found in the database.
 */
export function authenticateUser(
  phone: string,
  _credential: string,
  _method: 'otp' | 'password' = 'otp'
): { success: boolean; message: string; user?: RegisteredUser } {
  const cleanPhone = phone.trim().replace(/\D/g, '');

  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, message: 'Please enter your registered 10-digit mobile number.' };
  }

  const users = getRegisteredUsers();
  const user = users.find(u => u.phone === cleanPhone);

  if (!user) {
    return {
      success: false,
      message: `No account found for +91 ${cleanPhone}. You must register first before signing in!`
    };
  }

  // Save session
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to persist session', e);
  }

  return {
    success: true,
    message: `Welcome back, ${user.name}!`,
    user
  };
}

/**
 * Get active session user from storage.
 */
export function getSessionUser(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear active session.
 */
export function clearSessionUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
