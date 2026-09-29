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

export const ROLE_ICONS: Record<string, string> = {
  entrepreneur: '🌾',
  fpo_manager: '🏢',
  institutional_buyer: '🏢',
  bank_officer: '🪙'
};

/**
 * Retrieve all registered users from local persistent database.
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
 * Get all accounts associated with a specific phone number.
 */
export function getAccountsByPhone(phone: string): RegisteredUser[] {
  const cleanPhone = phone.trim().replace(/\D/g, '');
  if (!cleanPhone) return [];
  const users = getRegisteredUsers();
  return users.filter(u => u.phone === cleanPhone);
}

/**
 * Register a new user role into the database.
 * Supports multiple roles on the same phone number.
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
  // Check if this specific phone + role already exists
  const existingRoleAccount = users.find(u => u.phone === cleanPhone && u.role === data.role);
  if (existingRoleAccount) {
    return { 
      success: false, 
      message: `You already have an active "${ROLE_LABELS[data.role]}" account with +91 ${cleanPhone}. Please switch to "Sign In".` 
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
    message: `Account registered successfully as ${newUser.roleLabel}! Welcome, ${newUser.name}.`,
    user: newUser
  };
}

/**
 * Authenticate an existing registered user.
 * If multiple roles exist for the phone number and no specific account is targeted,
 * returns all matching accounts so the user can choose.
 */
export function authenticateUser(
  phone: string,
  _credential: string = '',
  _method: 'otp' | 'password' = 'otp',
  targetAccountId?: string
): { success: boolean; message: string; user?: RegisteredUser; accounts?: RegisteredUser[] } {
  const cleanPhone = phone.trim().replace(/\D/g, '');

  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, message: 'Please enter your registered 10-digit mobile number.' };
  }

  const matchingUsers = getAccountsByPhone(cleanPhone);

  if (matchingUsers.length === 0) {
    return {
      success: false,
      message: `No account found for +91 ${cleanPhone}. You must register first before signing in!`
    };
  }

  // If targeted account is specified, use that one
  if (targetAccountId) {
    const selected = matchingUsers.find(u => u.id === targetAccountId);
    if (selected) {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(selected));
      } catch (e) {
        console.error('Failed to persist session', e);
      }
      return { success: true, message: `Welcome back, ${selected.name}!`, user: selected };
    }
  }

  // If exactly 1 account exists, log in directly
  if (matchingUsers.length === 1) {
    const singleUser = matchingUsers[0];
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(singleUser));
    } catch (e) {
      console.error('Failed to persist session', e);
    }
    return {
      success: true,
      message: `Welcome back, ${singleUser.name}!`,
      user: singleUser
    };
  }

  // If multiple accounts exist for this phone number, return accounts for user selection
  return {
    success: true,
    message: `Found ${matchingUsers.length} profiles linked to +91 ${cleanPhone}. Please select which role profile to access:`,
    accounts: matchingUsers
  };
}

/**
 * Set active session user directly.
 */
export function setActiveSessionUser(user: RegisteredUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to set active session user', e);
  }
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
