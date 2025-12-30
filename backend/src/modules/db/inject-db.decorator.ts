import { Inject } from "@nestjs/common";

import { DB_CONNECTION } from "./db.module";

export const InjectDb = () => Inject(DB_CONNECTION);
