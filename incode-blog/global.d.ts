type ShareData = {
  title?: string
  text?: string
  url?: string
}

interface Navigator {
  share?: (data?: ShareData) => Promise<void>
  canShare?: (data?: ShareData) => boolean
}

declare module '@mailchimp/mailchimp_marketing' {
  type Config = {
    apiKey?: string
    accessToken?: string
    server?: string
  }

  export type SetListMemberBody = {
    email_address: string
    status:
      | 'subscribed'
      | 'unsubscribed'
      | 'cleaned'
      | 'pending'
      | 'transactional'
  }

  export default {
    setConfig: (config: Config) => {},
    lists: {
      addListMember: (
        listId: string,
        body: SetListMemberBody,
      ): Promise<void> => {},
    },
  }
}
