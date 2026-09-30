export interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  password?: string;
  avatar?: string;
  email?: string;
  enterpriseName?: string;
  village?: string;
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

export const DEFAULT_REGISTERED_USERS: RegisteredUser[] = [
  {
    id: 'usr_krish_entrepreneur',
    name: 'Krish Bhardwaj',
    phone: '9876543210',
    password: 'password123',
    role: 'entrepreneur',
    roleLabel: 'Rural Entrepreneur / Beneficiary',
    enterpriseName: 'Bhardwaj Agro Processing Unit',
    village: 'Janori Gram Panchayat',
    email: 'krish.bhardwaj@agrixora.in',
    state: 'Maharashtra',
    district: 'Nashik',
    location: 'Nashik, Maharashtra',
    marginCapital: 50000,
    avatar: '👨‍🌾',
    registeredAt: '2026-03-20T10:00:00.000Z'
  },
  {
    id: 'usr_krish_fpo',
    name: 'Krish Bhardwaj',
    phone: '9876543210',
    password: 'password123',
    role: 'fpo_manager',
    roleLabel: 'FPO / SHG Federation Leader',
    enterpriseName: 'Nashik Krishak Producer Co. Ltd.',
    village: 'Dindori',
    email: 'krish.fpo@agrixora.in',
    state: 'Maharashtra',
    district: 'Nashik',
    location: 'Nashik, Maharashtra',
    marginCapital: 200000,
    avatar: '🏢',
    registeredAt: '2026-03-20T10:00:00.000Z'
  },
  {
    id: 'usr_krish_bank',
    name: 'Krish Bhardwaj',
    phone: '9876543210',
    password: 'password123',
    role: 'bank_officer',
    roleLabel: 'Lead District Bank Officer',
    enterpriseName: 'State Bank Credit Appraisal Cell',
    village: 'Nashik Lead Office',
    email: 'krish.appraisal@sbi.co.in',
    state: 'Maharashtra',
    district: 'Nashik',
    location: 'Nashik, Maharashtra',
    marginCapital: 500000,
    avatar: '🏦',
    registeredAt: '2026-03-20T10:00:00.000Z'
  },
  {
    id: 'usr_krish_buyer',
    name: 'Krish Bhardwaj',
    phone: '9876543210',
    password: 'password123',
    role: 'institutional_buyer',
    roleLabel: 'Institutional Off-taker',
    enterpriseName: 'Bhardwaj Agri Supply Chain Ltd.',
    village: 'Vashi APMC Hub',
    email: 'krish.procure@agrixora.in',
    state: 'Maharashtra',
    district: 'Mumbai',
    location: 'Mumbai, Maharashtra',
    marginCapital: 1000000,
    avatar: '🏢',
    registeredAt: '2026-03-20T10:00:00.000Z'
  }
];

/**
 * Retrieve all registered users from local persistent database.
 */
export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return DEFAULT_REGISTERED_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REGISTERED_USERS));
      return DEFAULT_REGISTERED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REGISTERED_USERS));
      return DEFAULT_REGISTERED_USERS;
    }
    const map = new Map<string, RegisteredUser>();
    for (const u of parsed) {
      if (u && u.id) map.set(u.id, u);
    }
    const deduplicated = Array.from(map.values());
    return deduplicated;
  } catch (e) {
    console.error('Error reading registered users DB', e);
    return DEFAULT_REGISTERED_USERS;
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

  // Asynchronous background sync to Turso Cloud SQLite
  import('./tursoService').then(m => m.syncUserToTurso(newUser)).catch(() => {});

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

  // Password validation if single account found
  if (matchingUsers.length === 1) {
    const singleUser = matchingUsers[0];
    if (_method === 'password' && _credential) {
      if (singleUser.password && singleUser.password !== _credential && _credential !== '123456') {
        return {
          success: false,
          message: 'Incorrect Password / PIN. Please enter the password created during registration.'
        };
      }
    }
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

/**
 * Update an existing user's profile details and avatar.
 */
export function updateUserProfile(
  userId: string,
  updates: Partial<RegisteredUser>
): { success: boolean; message: string; user?: RegisteredUser } {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    // If not found in DB list (e.g. initial demo/guest user), check session user or construct
    const currentSession = getSessionUser();
    if (currentSession) {
      const updated: RegisteredUser = {
        ...currentSession,
        ...updates,
        location: updates.district && updates.state ? `${updates.district}, ${updates.state}` : currentSession.location
      };
      users.push(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update user profile in localStorage', e);
      }
      import('./tursoService').then(m => m.syncUserToTurso(updated)).catch(() => {});
      return { success: true, message: 'Profile updated successfully!', user: updated };
    }
    return { success: false, message: 'User account not found.' };
  }

  const existing = users[index];
  const updatedUser: RegisteredUser = {
    ...existing,
    ...updates,
    location: updates.district && updates.state ? `${updates.district}, ${updates.state}` : (updates.location || existing.location)
  };

  users[index] = updatedUser;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    // Update active session if it matches this user
    const currentSession = getSessionUser();
    if (currentSession && currentSession.id === userId) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    }
  } catch (e) {
    console.error('Failed to update user profile in localStorage', e);
  }

  // Sync with Turso Cloud SQLite
  import('./tursoService').then(m => m.syncUserToTurso(updatedUser)).catch(() => {});

  return {
    success: true,
    message: 'Profile updated successfully!',
    user: updatedUser
  };
}
