const secret = process.env.VIP_SECRET
const key = process.env.VIP_KEY

const validateVipCode = async (code) => {
  const { createHmac } = await import('node:crypto')
  const hash = createHmac('sha256', secret).update(code).digest('hex')
  return hash === key
}

export default function handler(req, res) {
  const code = req?.body?.code
  validateVipCode(code)
    .then((isVIP) => {
      isVIP ? res.status(200).json({ isVIP }) : res.status(403).json({ isVIP })
    })
    .catch(() => res.status(400).json({ isVIP: false }))
}
