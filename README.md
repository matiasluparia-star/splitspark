# SplitSpark

Split a shared bill into exact NIM amounts and create one reimbursement link per guest.

Run `npm ci`, then `npm test` and `npm run build`. Serve the contents of dist over HTTPS. For development use `npm run dev`.

Enter the total in NIM, the group size including yourself, and your public Nimiq address. Share each request individually. Open a request inside Nimiq Pay, verify the recipient and amount, and review it using the native confirmation dialog. The app uses the official Mini App SDK and displays the returned transaction hash. Check wallet history for confirmation and before retrying a payment.

Request details are encoded in shareable links. Anyone with a link can view it. Links can be edited or reused, so verify the details before paying. There is no server or group-wide payment tracking.

Automated tests use a simulated provider. On-device verification is pending. See the [Nimiq Mini Apps documentation](https://nimiq.dev/mini-apps).
