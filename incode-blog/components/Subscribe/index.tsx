import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './Subscribe.module.scss'

type SubscribeProps = {
  subscriberName: string
  subscriberEmail: string
}
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
const NAME_PATTERN = /^[A-Za-z]+$/i

const Subscribe = () => {
  const [message, setMessage] = useState('')
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SubscribeProps>()

  const onFormSubmit = async (formData: SubscribeProps) => {
    try {
      await axios.post('api/subscribe', {
        email: formData.subscriberEmail,
      })
      setMessage('Success! You are now subscribed.')
    } catch (e) {
      setMessage('Something went wrong')
    }
    reset()
  }

  return (
    <div className={styles.subscribe}>
      <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <div className={styles.message}>
          {message ? message : `Subscribe to our newsletter`}
        </div>
        <div className={styles.form}>
          <span className={styles.form_field}>
            <label htmlFor="subscriberName" className={styles.label}>
              {' '}
              {errors.subscriberName && errors.subscriberName.message}
            </label>
            <input
              id="subscriberName"
              name="subscriberName"
              placeholder="Your name"
              {...register('subscriberName', {
                required: '* name is required',
                pattern: NAME_PATTERN,
              })}
            />
          </span>
          <span className={styles.form_field}>
            <label htmlFor="subscriberEmail" className={styles.label}>
              {' '}
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
