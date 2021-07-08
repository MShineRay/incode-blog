import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { subscribeEmail } from '~/utils/blogRepository'
import emailImage from '~/public/images/email.svg'
import styles from './Subscribe.module.scss'

type SubscribeProps = {
  subscriberName: string
  subscriberEmail: string
}
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

const Subscribe = () => {
  const [message, setMessage] = useState<string>('')
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SubscribeProps>()

  const onFormSubmit = async (formData: SubscribeProps) => {
    try {
      await subscribeEmail({ email: formData.subscriberEmail })
      setMessage('Success! You are now subscribed.')
    } catch (e) {
      setMessage('Something went wrong')
    }
    reset()
  }

  return (
    <div className={styles.subscribe}>
      <img src={emailImage} alt="subscribe to newsletter" />
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <div className={styles.message}>
          {message ? (
            <h3>{message}</h3>
          ) : (
            <h3>
              Want product news and updates? <br />
              Sign up for our newsletter
            </h3>
          )}
        </div>
        <div className={styles.form}>
          <span className={styles.form_field}>
            <label htmlFor="subscriberEmail" className={styles.label}>
              {errors.subscriberEmail && errors.subscriberEmail.message}
            </label>
            <input
              id="subscriberEmail"
              name="subscriberEmail"
              placeholder="Your email"
              {...register('subscriberEmail', {
                required: '* email is required',
                pattern: {
                  value: EMAIL_PATTERN,
                  message: 'wrong format',
                },
              })}
            />
          </span>
          <button type="submit">Subscribe now</button>
        </div>
      </form>
    </div>
  )
}

export default Subscribe
