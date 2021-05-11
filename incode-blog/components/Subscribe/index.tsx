import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './Subscribe.module.scss'

type SubscribeProps = {
  subscriberName: string
  subscriberEmail: string
}

const Subscribe = () => {
  const [message, setMessage] = useState('')
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SubscribeProps>()

  const onFormSubmit = async (formData: SubscribeProps) => {
    setMessage('Success! You are now subscribed.')
    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({ email: formData.subscriberEmail }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    if (error) {
      setMessage(error)
      return
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
              {errors.subscriberName && errors.subscriberName.message}
            </label>
            <input
              id="subscriberName"
              name="subscriberName"
              placeholder="Your name"
              {...register('subscriberName', {
                required: '* name is required',
                pattern: /^[A-Za-z]+$/i,
              })}
            />
          </span>
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
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
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
