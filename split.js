export function address(input) {
  const raw = input.replace(/\s/g, '').toUpperCase()
  if (!/^NQ\d{2}[0-9A-HJ-NP-VXY]{32}$/.test(raw)) throw Error('Invalid Nimiq address')
  let remainder = 0
  for (const char of raw.slice(4) + raw.slice(0, 4)) {
    for (const digit of parseInt(char, 36).toString()) remainder = (remainder * 10 + Number(digit)) % 97
  }
  if (remainder !== 1) throw Error('Invalid address checksum')
  return raw.match(/.{4}/g).join(' ')
}

export function split(total, people) {
  if (!/^\d{1,10}(\.\d{1,5})?$/.test(total)) throw Error('Enter NIM with up to five decimal places')
  const [whole, fraction = ''] = total.split('.')
  const luna = Number(whole) * 100000 + Number(fraction.padEnd(5, '0'))
  if (!Number.isInteger(people) || people < 2 || people > 50 || luna < people) throw Error('Enter 2–50 people and at least one Luna each')
  return Array.from({ length: people }, (_, i) => Math.floor(luna / people) + Number(i < luna % people))
}

export async function pay(provider, recipient, value) {
  if (!Number.isSafeInteger(value) || value < 1) throw Error('Invalid payment amount')
  return provider.sendBasicTransaction({ recipient: address(recipient), value })
}
