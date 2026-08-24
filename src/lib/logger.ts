type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  service?: string;
  correlationId?: string;
  userId?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  error?: Error | unknown;
}

export class Logger {
  private service: string;

  constructor(service: string = "web") {
    this.service = service;
  }

  private format(level: LogLevel, payload: LogPayload) {
    const timestamp = new Date().toISOString();
    const logObj: Record<string, unknown> = {
      timestamp,
      level: level.toUpperCase(),
      service: payload.service || this.service,
      message: payload.message,
    };

    if (payload.correlationId) logObj.correlationId = payload.correlationId;
    if (payload.userId) logObj.userId = payload.userId;
    if (payload.entityId) logObj.entityId = payload.entityId;
    if (payload.metadata) logObj.metadata = payload.metadata;
    if (payload.error) {
      logObj.error =
        payload.error instanceof Error
          ? {
              name: payload.error.name,
              message: payload.error.message,
              stack: payload.error.stack,
            }
          : payload.error;
    }

    return JSON.stringify(logObj);
  }

  info(message: string, meta?: Partial<LogPayload>) {
    console.log(this.format("info", { message, ...meta }));
  }

  warn(message: string, meta?: Partial<LogPayload>) {
    console.warn(this.format("warn", { message, ...meta }));
  }

  error(message: string, meta?: Partial<LogPayload>) {
    console.error(this.format("error", { message, ...meta }));
  }

  debug(message: string, meta?: Partial<LogPayload>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.format("debug", { message, ...meta }));
    }
  }
}

export const logger = new Logger("infomats-real-estate");
