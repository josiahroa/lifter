import {
  PowerSyncDatabase,
  createBaseLogger,
  LogLevel,
} from "@powersync/react-native";
import { OPSqliteOpenFactory } from "@powersync/op-sqlite";
import { AppSchema } from "./schema";
import { SupabaseConnector } from "./connector";
import { createContext, useContext } from "react";

const logger = createBaseLogger();
logger.useDefaults();
logger.setLevel(LogLevel.INFO);

export class System {
  supabaseConnector: SupabaseConnector;
  powersync: PowerSyncDatabase;

  constructor() {
    this.supabaseConnector = new SupabaseConnector();

    const opSqlite = new OPSqliteOpenFactory({
      dbFilename: "powersync.db",
    });

    this.powersync = new PowerSyncDatabase({
      database: opSqlite,
      schema: AppSchema,
      logger,
    });
  }

  async init() {
    await this.powersync.init();
    await this.powersync.connect(this.supabaseConnector);
  }
}

export const system = new System();

export const SystemContext = createContext(system);
export const useSystem = () => useContext(SystemContext);
