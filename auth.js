// ============================================
// REDDRPULSE - SUPABASE AUTHENTICATION
// ============================================

// Supabase configuration - Replace with your own credentials
const SUPABASE_URL = 'YOUR_SUPABAShttps://nuvwputudglrlzkizwqw.supabase.coE_URL';
const SUPABASE_KEY = 'YOUR_SUPAsb_publishable_7fMgT0rUKLkVZWmiXg7Cmw_7E_rR0KVBASE_ANON_KEY';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPAhttps://nuvwputudglrlzkizwqw.supabase.coBASE_URL, SUPsb_publishable_7fMgT0rUKLkVZWmiXg7Cmw_7E_rR0KVABASE_KEY);

// Auth state management
let currentUser = null;

// Check current session on load
async function checkSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      currentUser = session.user;
      updateUIForLoggedInUser(session.user);
    }
  } catch (error) {
    console.error('Session check error:', error);
  }
}

// Sign up new user
async function signUp(email, password, fullName, website) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          website: website
        }
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
}

// Sign in user
async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    currentUser = data.user;
    return { success: true, data };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

// Sign out user
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    currentUser = null;
    updateUIForLoggedOutUser();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// Get current user
async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// Update user profile
async function updateProfile(updates) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }
}

// Update UI based on auth state
function updateUIForLoggedInUser(user) {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const userMenu = document.getElementById('userMenu');

  if (loginBtn) loginBtn.style.display = 'none';
  if (signupBtn) signupBtn.style.display = 'none';

  if (userMenu) {
    userMenu.style.display = 'flex';
    const userAvatar = userMenu.querySelector('.user-avatar');
    const userName = userMenu.querySelector('.user-name');
    if (userAvatar && user.user_metadata?.full_name) {
      userAvatar.textContent = getInitials(user.user_metadata.full_name);
    }
    if (userName) {
      userName.textContent = user.user_metadata?.full_name || user.email;
    }
  }
}

function updateUIForLoggedOutUser() {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const userMenu = document.getElementById('userMenu');

  if (loginBtn) loginBtn.style.display = 'block';
  if (signupBtn) signupBtn.style.display = 'block';
  if (userMenu) userMenu.style.display = 'none';
}

// Helper function to get initials
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Show notification toast
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="margin-right:8px">${type === 'success' ? '✓' : '✕'}</span>
    ${message}
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 14px 20px;
    background: ${type === 'success' ? '#2d9d6a' : '#e55'};
    color: white;
    border-radius: 10px;
    font-weight: 500;
    z-index: 10000;
    animation: slideUp 0.3s ease;
    display: flex;
    align-items: center;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    currentUser = session.user;
    updateUIForLoggedInUser(session.user);
  } else if (event === 'SIGNED_OUT') {
    currentUser = null;
    updateUIForLoggedOutUser();
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', checkSession);

// Export functions for use in other files
window.auth = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  updateProfile,
  checkSession,
  showToast
};
