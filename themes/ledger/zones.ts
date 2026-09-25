/** The Zones Ledger draws, top to bottom. */
export const LEDGER_ZONES = ["header", "main"] as const;

export type LedgerZone = (typeof LEDGER_ZONES)[number];
