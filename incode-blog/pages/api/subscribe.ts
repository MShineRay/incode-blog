import axios from 'axios'

const getRequestParams = (email: string) => {
  const API_KEY = process.env.MAILCHIMP_API_KEY
  const AUDIENCE_ID = process.env.MAILCHIMP_API_SERVER
  const API_SERVER = process.env.MAILCHIMP_API_SERVER

  const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`
  const data = {
    email_address: email,
    status: 'subscribed',
  }
  const base64ApiKey = Buffer.from(`anystring:${API_KEY}`).toString('base64')
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64ApiKey}`,
  }
  return { url, data, headers }
}

export default async (req, res) => {
  const { email } = req.body
  const { url, data, headers } = getRequestParams(email)
  const message = await axios.post(url, data, { headers })
  return message
}
