// API utility functions for authenticated requests

const API_BASE_URL = "http://127.0.0.1:8000/api"

// Get access token from cookies
function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null
  
  const nameEQ = "access_token="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// Get refresh token from cookies
function getRefreshToken(): string | null {
  if (typeof document === 'undefined') return null
  
  const nameEQ = "refresh_token="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// Set cookie utility
function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`
}

// Delete cookie utility
function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Refresh access token
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await fetch(`${API_BASE_URL}/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      setCookie("access_token", data.access, 1) // 1 day
      return data.access
    } else {
      // Refresh failed, clear tokens
      deleteCookie("access_token")
      deleteCookie("refresh_token")
      return null
    }
  } catch (error) {
    console.error("Token refresh error:", error)
    deleteCookie("access_token")
    deleteCookie("refresh_token")
    return null
  }
}

// Make authenticated API request
export async function authenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  let accessToken = getAccessToken()

  // If no access token, try to refresh
  if (!accessToken) {
    accessToken = await refreshAccessToken()
  }

  // Prepare headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  // Make the request
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // If unauthorized, try to refresh token and retry once
  if (response.status === 401 && accessToken) {
    const newAccessToken = await refreshAccessToken()
    if (newAccessToken) {
      headers["Authorization"] = `Bearer ${newAccessToken}`
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })
    }
  }

  return response
}

// API endpoints
export const api = {
  // Auth endpoints
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, phone_number: string = "None") =>
    fetch(`${API_BASE_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone_number }),
    }),

  refresh: (refreshToken: string) =>
    fetch(`${API_BASE_URL}/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    }),

  // User endpoints
  getCurrentUser: () => authenticatedRequest("/user/me/"),
  
  updateProfile: (data: any) =>
    authenticatedRequest("/user/update_profile/", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    authenticatedRequest("/user/change_password/", {
      method: "POST",
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    }),

  // Chat endpoints
  getChats: () => authenticatedRequest("/chat/"),
  
  getChatMessages: (chatId: string) =>
    authenticatedRequest(`/chat/${chatId}/get_messages/`),
  
  getUnreadMessages: (chatId: string) =>
    authenticatedRequest(`/chat/${chatId}/get_unread_messages/`),
  
  addUserToChat: (chatId: string, userId: string) =>
    authenticatedRequest(`/chat/${chatId}/add_user/`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    }),
  
  removeUserFromChat: (chatId: string, userId: string) =>
    authenticatedRequest(`/chat/${chatId}/remove_user/`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    }),

  // Message endpoints
  getMessages: () => authenticatedRequest("/messages/"),
  
  createMessage: (data: {
    chat?: string;
    group?: string;
    type: string;
    content: string;
  }) =>
    authenticatedRequest("/messages/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  markMessageDelivered: (messageId: string) =>
    authenticatedRequest(`/messages/${messageId}/mark_delivered/`, {
      method: "POST",
    }),
  
  markMessageSeen: (messageId: string) =>
    authenticatedRequest(`/messages/${messageId}/mark_seen/`, {
      method: "POST",
    }),
  
  getUnreadMessages: () => authenticatedRequest("/messages/mark_unread/"),
  
  // User search API
  filterUser: (phoneNumber: string) =>
    authenticatedRequest(`/user/filter_user?phone_number=${phoneNumber}`, {
      method: "GET",
    }),
  
  // Create chat API
  createChat: (name: string, userIds: string[]) =>
    authenticatedRequest("/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        user_ids: userIds,
      }),
    }),
}
