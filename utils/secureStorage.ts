import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "pneumodetect_auth_token";
const USER_DATA_KEY = "pneumodetect_user_data";

export const storeAccessToken = async (token: string | any): Promise<void> => {
  try {
    const tokenString =
      typeof token === "string" ? token : JSON.stringify(token);
    if (!tokenString || tokenString.length === 0 || tokenString === "{}") {
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, tokenString);
  } catch (error) {
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token || null;
  } catch (error) {
    return null;
  }
};

export const storeUserData = async (user: any): Promise<void> => {
  try {
    const userData = JSON.stringify(user);
    await SecureStore.setItemAsync(USER_DATA_KEY, userData);
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

export const clearAuthData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  } catch (error) {
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
    throw error;
  }
};

export const hasSeenOnboarding = async (): Promise<boolean> => {
  try {
    const flag = await SecureStore.getItemAsync(ONBOARDING_FLAG_KEY);
    return flag ? JSON.parse(flag) : false;
  } catch (error) {
    return false;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
    await SecureStore.deleteItemAsync(ONBOARDING_FLAG_KEY);
  } catch (error) {
    throw error;
  }
};
