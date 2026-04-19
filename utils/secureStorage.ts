import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "pneumodetect_auth_token";
const USER_DATA_KEY = "pneumodetect_user_data";

export const storeAccessToken = async (token: string | any): Promise<void> => {
  try {
    const tokenString =
      typeof token === "string" ? token : JSON.stringify(token);
    if (!tokenString || tokenString.length === 0 || tokenString === "{}") {
      console.warn("Cannot store empty token");
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, tokenString);
  } catch (error) {
    console.error("Failed to store access token:", error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token || null;
  } catch (error) {
    console.warn("Failed to retrieve access token:", error);
    return null;
  }
};

export const storeUserData = async (user: any): Promise<void> => {
  try {
    const userData = JSON.stringify(user);
    await SecureStore.setItemAsync(USER_DATA_KEY, userData);
  } catch (error) {
    console.error("Failed to store user data:", error);
    throw error;
  }
};

export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.warn("Failed to retrieve user data:", error);
    return null;
  }
};

export const clearAuthData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  } catch (error) {
    console.error("Failed to clear auth data:", error);
    throw error;
  }
};

export const isTokenValid = async (): Promise<boolean> => {
  const token = await getAccessToken();
  return !!token;
};

const ONBOARDING_FLAG_KEY = "pneumodetect_has_seen_onboarding";

export const storeOnboardingFlag = async (seen: boolean): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ONBOARDING_FLAG_KEY, JSON.stringify(seen));
  } catch (error) {
    console.error("Failed to store onboarding flag:", error);
    throw error;
  }
};

export const hasSeenOnboarding = async (): Promise<boolean> => {
  try {
    const flag = await SecureStore.getItemAsync(ONBOARDING_FLAG_KEY);
    return flag ? JSON.parse(flag) : false;
  } catch (error) {
    console.warn("Failed to retrieve onboarding flag:", error);
    return false;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
    await SecureStore.deleteItemAsync(ONBOARDING_FLAG_KEY);
  } catch (error) {
    console.error("Failed to clear all data:", error);
    throw error;
  }
};
