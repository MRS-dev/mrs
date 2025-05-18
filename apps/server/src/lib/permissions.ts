// src/lib/permissions.ts
import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  project: ["create", "read", "update", "delete"],
  reports: ["read", "export"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  user: ac.newRole({
    project: ["create"],
  }),
  admin: ac.newRole({
    project: ["create", "update"],
  }),
  pro: ac.newRole({
    project: ["create", "read", "update"],
    reports: ["read", "export"],
  }),
} as const;
export type Roles = keyof typeof roles;
