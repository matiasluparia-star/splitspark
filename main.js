import { init } from '@nimiq/mini-app-sdk'
import { address, split, pay } from './split.js'

const byId = id => document.getElementById(id)
const status = byId('status')
const format = value => (value / 100000).toFixed(5) + ' NIM'
const form = byId('split')
const params = new URLSearchParams(location.hash.slice(1))

form.addEventListener('submit', event => {
  event.preventDefault()
  byId('links').replaceChildren()
  try {
    const fields = new FormData(form)
    const recipient = address(fields.get('recipient'))
    const shares = split(fields.get('total'), Number(fields.get('people')))
    status.textContent = 'Your share is ' + format(shares[0]) + '. Share one request per other person.'
    for (const value of shares.slice(1)) {
      const url = new URL(location.href)
      url.hash = new URLSearchParams({ to: recipient, luna: value, id: crypto.randomUUID() })
      const item = document.createElement('li')
      const link = document.createElement('a')
      link.href = url.href
      link.textContent = format(value)
      const copy = document.createElement('button')
      copy.textContent = 'Copy request'
      copy.onclick = async () => {
        try {
          await navigator.clipboard.writeText(url.href)
          copy.textContent = 'Copied'
        } catch {
          status.textContent = 'Open the request and copy its address from the browser.'
        }
      }
      item.append(link, copy)
      byId('links').append(item)
    }
  } catch (error) {
    status.textContent = error.message
  }
})

if (location.hash) {
  form.hidden = true
  try {
    const recipient = address(params.get('to') ?? '')
    const value = Number(params.get('luna'))
    if (!Number.isSafeInteger(value) || value < 1) throw Error('Invalid request amount')
    byId('request').hidden = false
    byId('recipient').textContent = recipient
    byId('amount').textContent = format(value)
    const button = byId('pay')
    button.onclick = async () => {
      button.disabled = true
      status.textContent = 'Waiting for Nimiq Pay…'
      try {
        const provider = await init()
        const hash = await pay(provider, recipient, value)
        status.textContent = 'Transaction returned by wallet. Verify confirmation separately. Hash: ' + hash
      } catch {
        status.textContent = 'No transaction hash received. Check Nimiq Pay history before trying again. Open this request inside Nimiq Pay to pay.'
        button.disabled = false
      }
    }
  } catch (error) {
    status.textContent = error.message
  }
}
