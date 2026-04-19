/**
 * Date and Time Formatting Utilities
 */

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return formatDate(timestamp);
  } catch {
    return "Invalid date";
  }
};

/**
 * Format timestamp to readable date (e.g., "Feb 17, 2024")
 */
export const formatDate = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format timestamp to time only (e.g., "2:30 PM")
 */
export const formatTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "Invalid time";
  }
};

/**
 * Format timestamp to full date and time (e.g., "Feb 17, 2024 2:30 PM")
 */
export const formatDateTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Extract IP country/region from IP address (basic heuristic)
 */
export const formatIPAddress = (ip: string): string => {
  if (!ip) return "Unknown";
  // Truncate to first 3 octets for privacy
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
  }
  return ip;
};

/**
 * Extract browser/device info from user agent
 */
export const extractBrowserInfo = (userAgent: string): string => {
  if (!userAgent) return "Unknown Device";

  // Simple extraction logic
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("iPhone")) return "iPhone";
  if (userAgent.includes("iPad")) return "iPad";
  if (userAgent.includes("Android")) return "Android";

  return "Unknown Device";
};
