import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";
import type { AdapterAccount } from "@auth/core/adapters";

export const userRole = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  password: text("password"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image")
    .default("https://api.dicebear.com/8.x/initials/svg")
    .notNull(),
  role: userRole("role").default("USER").notNull(),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false).notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationTokens = pgTable("verification_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  email: text("email")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  expires: timestamp("expires").notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  email: text("email")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  expires: timestamp("expires").notNull(),
});

export const twoFactorTokens = pgTable("two_factor_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  email: text("email")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  expires: timestamp("expires").notNull(),
});

export const twoFactorConfirmations = pgTable("two_factor_confirmation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type UserRole = "USER" | "ADMIN";

export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type TwoFactorToken = typeof twoFactorTokens.$inferSelect;
export type TwoFactorConfirmation = typeof twoFactorConfirmations.$inferSelect;
