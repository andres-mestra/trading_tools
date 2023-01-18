export const postValidateVIP = async (code) => {
  try {
    const resp = await fetch('/api/vip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    const data = await resp.json()
    return data
  } catch (error) {
    console.error(error)
    return { error }
  }
}
