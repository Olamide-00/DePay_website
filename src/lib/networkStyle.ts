import type { VTPassService } from "../types";

// The 4 networks we show, in a fixed display order. `match` covers the
// name variants providers use — 9mobile is sometimes still labelled
// "Etisalat", its pre-rebrand name, in provider data.
export const NETWORKS = [
  { match: ["mtn"], label: "MTN", badge: "bg-amber-500 text-forest-950" },
  { match: ["airtel"], label: "Airtel", badge: "bg-red-600 text-white" },
  { match: ["glo"], label: "Glo", badge: "bg-leaf-500 text-forest-950" },
  {
    match: ["9mobile", "etisalat"],
    label: "9mobile",
    badge: "bg-forest-700 text-cream-50",
  },
] as const;

export function networkFor(name: string) {
  const lower = name.toLowerCase();
  return NETWORKS.find((n) => n.match.some((m) => lower.includes(m)));
}

// Providers sometimes return several service IDs per network (SME,
// gifting, corporate, "share" bundles, etc). This narrows the list down
// to one normal/direct service per network, in the fixed display order
// above — used anywhere we show a 4-tile network picker.
export function pickNormalServices(
  services: VTPassService[] | undefined,
): VTPassService[] {
  if (!services) return [];
  return NETWORKS.map((net) => {
    const matches = services.filter((s) =>
      net.match.some((m) => s.name.toLowerCase().includes(m)),
    );
    if (matches.length === 0) return null;
    const plain = matches.find(
      (s) => !/sme|share|gifting|corporate|awoof/i.test(s.name),
    );
    return plain ?? matches[0];
  }).filter((s): s is VTPassService => s !== null);
}
