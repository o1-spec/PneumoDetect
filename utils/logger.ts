/**
 * Logger utility for structured error/info logging
 * Non-sensitive information only for debugging
 */

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  context?: Record<string, unknown>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  /**
   * Info level logging
   */
  info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  }

  /**
   * Error level logging
   */
  error(message: string, context?: Record<string, unknown>) {
    this.log("error", message, context);
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: Record<string, unknown>) {
    if (__DEV__) {
      this.log("debug", message, context);
    }
  }

  /**
   * Core logging method
   */
  private log(
    level: LogEntry["level"],
    message: string,
    context?: Record<string, unknown>
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.sanitizeContext(context),
    };

    this.logs.push(entry);

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output in development
    if (__DEV__) {
      const style = this.getConsoleStyle(level);
      console.log(`%c[${level.toUpperCase()}]`, style, message, context || "");
    }
  }

  /**
   * Sanitize context to remove sensitive data
   */
  private sanitizeContext(
    context?: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    if (!context) return undefined;

    const sensitiveKeys = [
      "password",
      "token",
      "accessToken",
      "refreshToken",
      "apiKey",
      "secret",
      "authorization",
      "creditCard",
      "ssn",
    ];

    const sanitized: Record<string, unknown> = {};

    Object.entries(context).forEach(([key, value]) => {
      if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = this.sanitizeContext(
          value as Record<string, unknown>
        );
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  /**
   * Get console styling for log level
   */
  private getConsoleStyle(level: LogEntry["level"]): string {
    const styles: Record<LogEntry["level"], string> = {
      info: "color: #0066CC; font-weight: bold",
      warn: "color: #FF9800; font-weight: bold",
      error: "color: #D32F2F; font-weight: bold",
      debug: "color: #999; font-weight: normal",
    };
    return styles[level];
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogEntry["level"]): LogEntry[] {
    return this.logs.filter((l) => l.level === level);
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs as JSON string for debugging/support
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Log API error with non-sensitive data
   */
  logApiError(
    endpoint: string,
    statusCode?: number,
    errorMessage?: string,
    context?: Record<string, unknown>
  ) {
    this.error(`API Error: ${endpoint}`, {
      endpoint,
      statusCode,
      errorMessage,
      ...context,
    });
  }

  /**
   * Log API request
   */
  logApiRequest(
    method: string,
    endpoint: string,
    context?: Record<string, unknown>
  ) {
    this.debug(`API Request: ${method} ${endpoint}`, context);
  }

  /**
   * Log API response
   */
  logApiResponse(
    method: string,
    endpoint: string,
    statusCode: number,
    context?: Record<string, unknown>
  ) {
    this.debug(`API Response: ${method} ${endpoint} [${statusCode}]`, context);
  }
}

// Export singleton instance
export const logger = new Logger();

export type { LogEntry };
