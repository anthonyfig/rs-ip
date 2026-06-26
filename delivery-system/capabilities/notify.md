# Capability: notify

Send a notification. Bound by `delivery.yml` → `notify.adapter`; see `../adapters/notify/`.

- `post(channel, message)` — e.g. a chat message on a new lead / finding.
- **Must never block** the primary action: if notify fails, retry or log out of band and continue.
