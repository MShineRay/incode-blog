import api from './api'

const subscribeEmailUrl = `api/subscribe`

type emailData = {
  email: string
}

export async function subscribeEmail(emailData: emailData) {
  const result = await api.post(subscribeEmailUrl, emailData, {})
  return result.data
}
