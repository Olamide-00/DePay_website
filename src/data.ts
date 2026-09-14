import type { LucideIcon } from 'lucide-react'
import { Smartphone, Wifi, Tv, Zap, GraduationCap, Ticket } from 'lucide-react'

export type Service = {
  icon: LucideIcon
  title: string
  blurb: string
  from: string
  providers: string[]
}

export const services: Service[] = [
  {
    icon: Smartphone,
    title: 'Airtime top-up',
    blurb: 'Recharge any Nigerian line in seconds, with bonus cashback on every top-up.',
    from: '₦50',
    providers: ['MTN', 'Airtel', 'Glo', '9mobile'],
  },
  {
    icon: Wifi,
    title: 'Data bundles',
    blurb: 'SME, gifting and direct data plans at rates lower than the standard tariff.',
    from: '₦100',
    providers: ['MTN', 'Airtel', 'Glo', '9mobile', 'Spectranet'],
  },
  {
    icon: Tv,
    title: 'TV subscriptions',
    blurb: 'Renew cable subscriptions instantly and never miss a match or premiere.',
    from: '₦1,500',
    providers: ['DStv', 'GOtv', 'StarTimes', 'Showmax'],
  },
  {
    icon: Zap,
    title: 'Electricity tokens',
    blurb: 'Prepaid and postpaid tokens delivered straight to your meter, nationwide.',
    from: '₦500',
    providers: ['EKEDC', 'IKEDC', 'AEDC', 'PHED', 'KEDCO'],
  },
  {
    icon: GraduationCap,
    title: 'Educational pins',
    blurb: 'WAEC, NECO, NABTEB and JAMB result checker pins, generated on the spot.',
    from: '₦900',
    providers: ['WAEC', 'NECO', 'NABTEB', 'JAMB'],
  },
  {
    icon: Ticket,
    title: 'Vouchers & gift cards',
    blurb: 'Buy and redeem Depay vouchers, or convert gift cards straight to wallet cash.',
    from: '₦1,000',
    providers: ['Depay Voucher', 'iTunes', 'Amazon', 'Steam'],
  },
]

export const stats = [
  { value: '2.4M+', label: 'Bills settled' },
  { value: '<10s', label: 'Avg. settlement time' },
  { value: '99.9%', label: 'Uptime' },
  { value: '40k+', label: 'Active users' },
]

export const steps = [
  {
    n: '01',
    title: 'Fund your wallet',
    body: 'Add money with your card, bank transfer, or USSD — it lands instantly and stays in Naira.',
  },
  {
    n: '02',
    title: 'Pick a bill',
    body: 'Airtime, data, TV, electricity or an exam pin. Save recurring bills as one-tap favourites.',
  },
  {
    n: '03',
    title: 'Confirm & get your receipt',
    body: 'One tap to pay. A digital receipt and token land in your history and inbox immediately.',
  },
]

export const testimonials = [
  {
    quote:
      "I moved my whole family's airtime and DStv onto Depay. The referral bonus alone has paid for two months of data.",
    name: 'Amaka O.',
    role: 'Lagos',
  },
  {
    quote:
      'Electricity tokens used to be the one bill I always forgot. Now it is scheduled and I get a receipt before the lights even flicker.',
    name: 'Tunde B.',
    role: 'Ibadan',
  },
  {
    quote:
      'Support answered a stuck transaction in four minutes and refunded it before I finished explaining. That is why I stayed.',
    name: 'Chiamaka N.',
    role: 'Enugu',
  },
]

export const faqs = [
  {
    q: 'How fast do payments actually settle?',
    a: 'Airtime and data settle in under 10 seconds on average. Electricity tokens and TV subscriptions typically settle within a minute, and you get a digital receipt either way.',
  },
  {
    q: 'What happens if a transaction fails?',
    a: 'If a bill fails after your wallet has been debited, Depay auto-reverses the funds to your wallet — usually within minutes, and always within 24 hours.',
  },
  {
    q: 'How does the referral bonus work?',
    a: 'Share your unique referral code. When someone signs up and completes their first transaction, you both receive a bonus credited straight to your wallet.',
  },
  {
    q: 'Can I use vouchers and coupons together?',
    a: 'Yes. Vouchers top up your wallet balance, while coupons apply a discount at checkout — you can stack one of each on a single transaction.',
  },
  {
    q: 'Is my money safe with Depay?',
    a: 'Wallet funds are held in a licensed, bank-partnered settlement account, and every transaction is encrypted end-to-end. Depay never stores your card PIN.',
  },
]
