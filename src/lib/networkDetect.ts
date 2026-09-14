export interface NetworkPrefixInfo {
  name: string
  match: RegExp // matches against a VTPass service's `name` or `serviceID`
  prefixes: string[]
}

export const NETWORK_PREFIXES: NetworkPrefixInfo[] = [
  { name: 'MTN', match: /mtn/i, prefixes: ['0803', '0806', '0813', '0814', '0816', '0903', '0906', '0913', '0916'] },
  { name: 'Airtel', match: /airtel/i, prefixes: ['0802', '0808', '0812', '0901', '0902', '0904', '0907', '0912'] },
  { name: 'Glo', match: /^glo/i, prefixes: ['0805', '0807', '0811', '0815', '0905', '0915'] },
  { name: '9mobile', match: /9mobile|etisalat/i, prefixes: ['0809', '0817', '0818', '0908', '0909'] },
]

export function detectNetworkName(phone: string): string | null {
  const p = phone.replace(/\s+/g, '')
  const match = NETWORK_PREFIXES.find((n) => n.prefixes.some((pre) => p.startsWith(pre)))
  return match?.name ?? null
}
