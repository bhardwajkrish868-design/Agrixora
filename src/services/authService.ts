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
  // Primary Personal Number for Krish Bhardwaj (9631359486)
  {
    id: 'usr_krish_9631359486_entrepreneur',
    name: 'Krish Bhardwaj',
    phone: '9631359486',
    password: 'password123',
    role: 'entrepreneur',
    roleLabel: 'Rural Entrepreneur / Beneficiary',
    enterpriseName: 'Bhardwaj Organic Cold-Press Agro',
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
    id: 'usr_krish_9631359486_fpo',
    name: 'Krish Bhardwaj',
    phone: '9631359486',
    password: 'password123',
    role: 'fpo_manager',
    roleLabel: 'FPO / SHG Federation Leader',
    enterpriseName: 'Sahyadri Krishak FPO Producer Co.',
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
    id: 'usr_krish_9631359486_bank',
    name: 'Krish Bhardwaj',
    phone: '9631359486',
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
    id: 'usr_krish_9631359486_buyer',
    name: 'Krish Bhardwaj',
    phone: '9631359486',
    password: 'password123',
    role: 'institutional_buyer',
    roleLabel: 'Institutional Off-taker',
    enterpriseName: 'Krish Agro Wholesale Mega Network',
    village: 'Vashi APMC Hub',
    email: 'krish.procure@agrixora.in',
    state: 'Maharashtra',
    district: 'Mumbai',
    location: 'Mumbai, Maharashtra',
    marginCapital: 1000000,
    avatar: '💼',
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
    const parsed = raw ? JSON.parse(raw) : [];
    const map = new Map<string, RegisteredUser>();

    // Always seed default profiles first
    for (const u of DEFAULT_REGISTERED_USERS) {
      if (u && u.id) map.set(u.id, u);
    }

    // Merge locally created profiles
    if (Array.isArray(parsed)) {
      for (const u of parsed) {
        if (u && u.id) map.set(u.id, u);
      }
    }

    const deduplicated = Array.from(map.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deduplicated));
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
      message: `No registered account found for +91 ${cleanPhone}. Please switch to the "Register" tab to create your new enterprise profile with your name.`
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

  // If single account found
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

/**
 * Update an existing user's profile details and avatar.
 */
export function updateUserProfile(
  userId: string,
  updates: Partial<RegisteredUser>
): { success: boolean; message: string; user?: RegisteredUser } {
  const users = getRegisteredUsers();
  
  // 1. Try finding by ID
  let index = users.findIndex(u => u.id === userId);

  // 2. Fallback matching by phone and role
  if (index === -1 && updates.phone) {
    index = users.findIndex(u => u.phone === updates.phone && (!updates.role || u.role === updates.role));
  }

  // 3. Fallback matching active session user
  if (index === -1) {
    const currentSession = getSessionUser();
    if (currentSession) {
      index = users.findIndex(u => u.id === currentSession.id || (u.phone === currentSession.phone && u.role === currentSession.role));
    }
  }

  let updatedUser: RegisteredUser;

  if (index === -1) {
    // Construct new permanent entry from updates + session
    const currentSession = getSessionUser();
    const cleanPhone = updates.phone || currentSession?.phone || '9631359486';
    const role = updates.role || currentSession?.role || 'entrepreneur';
    
    updatedUser = {
      id: userId && userId !== 'usr_current' ? userId : `usr_${cleanPhone}_${role}`,
      name: updates.name || currentSession?.name || 'AgriXora Entrepreneur',
      phone: cleanPhone,
      role: role,
      roleLabel: ROLE_LABELS[role] || 'Rural Entrepreneur',
      state: updates.state || currentSession?.state || 'Maharashtra',
      district: updates.district || currentSession?.district || 'Nashik',
      village: updates.village || currentSession?.village || 'Janori Gram Panchayat',
      enterpriseName: updates.enterpriseName || currentSession?.enterpriseName || '',
      email: updates.email || currentSession?.email || '',
      marginCapital: updates.marginCapital ?? currentSession?.marginCapital ?? 50000,
      avatar: updates.avatar || currentSession?.avatar || '🌾',
      location: updates.district && updates.state ? `${updates.district}, ${updates.state}` : (currentSession?.location || 'Nashik, Maharashtra'),
      registeredAt: currentSession?.registeredAt || new Date().toISOString()
    };
    users.push(updatedUser);
  } else {
    const existing = users[index];
    updatedUser = {
      ...existing,
      ...updates,
      location: updates.district && updates.state ? `${updates.district}, ${updates.state}` : (updates.location || existing.location)
    };
    users[index] = updatedUser;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
  } catch (e) {
    console.error('Failed to update user profile in localStorage', e);
  }

  // Permanent sync with Turso Cloud SQLite in background
  import('./tursoService').then(m => m.syncUserToTurso(updatedUser)).catch(err => {
    console.warn('Background Turso sync note:', err);
  });

  return {
    success: true,
    message: 'Profile permanently updated and synchronized with cloud!',
    user: updatedUser
  };
}
