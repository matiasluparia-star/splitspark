import test from 'node:test'
import assert from 'node:assert/strict'
import { split, address, pay } from './split.js'
const recipient = 'NQ07 0000 0000 0000 0000 0000 0000 0000 0000'
test('allocates every Luna', () => assert.deepEqual(split('1', 3), [33334, 33333, 33333]))
test('rejects invalid amounts and checksum', () => {
  assert.throws(() => split('0.00001', 2))
  assert.throws(() => address(recipient.replace('07', '08')))
})
test('passes exact values to the provider and propagates rejection', async () => {
  assert.equal(await pay({ sendBasicTransaction: request => {
    assert.deepEqual(request, { recipient, value: 33333 })
    return 'test-hash'
  } }, recipient, 33333), 'test-hash')
  await assert.rejects(pay({ sendBasicTransaction: () => { throw Error('rejected') } }, recipient, 1))
})
