import { OPSqliteOpenFactory } from "@powersync/op-sqlite";
import {
  PowerSyncDatabase,
  createBaseLogger,
  LogLevel,
} from "@powersync/react-native";
import { createContext, useContext } from "react";

import { Connector } from "./connector";
import { AppSchema } from "./schema";


const logger = createBaseLogger();
logger.useDefaults();
logger.setLevel(LogLevel.INFO);

export class System {
  supabaseConnector: Connector;
  powersync: PowerSyncDatabase;

  constructor() {
    this.supabaseConnector = new Connector();

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
