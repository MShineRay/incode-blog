import { useState } from 'react'
import { motion } from 'framer-motion'
import cx from 'classnames'
import styles from './CategorySelect.module.scss'
import arrowRight from '~/public/images/arrow-right.svg'
type CategorySelectProps = {
  categoryPlaceholder: string
  categoryArray: string[]
  handleCategorySelect: (selected: string) => void
}
const variantsImg = {
  open: { x: '100%', rotate: 180 },
  closed: { x: 0, rotate: 0 },
}

const variantsSpan = {
  open: {
    opacity: 1,
  },
  closed: {
    opacity: 0,
  },
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categoryPlaceholder,
  categoryArray,
  handleCategorySelect,
}: CategorySelectProps) => {
  const [selected, setSelected] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelected = (e, i) => {
    const val = e.currentTarget.textContent
    setSelected(val)
    handleCategorySelect(i)
    setIsOpen(false)
  }

  const dropdownList = props => {
    const list = props.map((item, i) => (
      <div
        className={styles.item}
        onClick={e => handleSelected(e, item)}
        key={i}
      >
        {item}
      </div>
    ))
    return (
      <div className={cx(styles.list, { [styles.active]: isOpen })}>{list}</div>
    )
  }
  return (
    <div className={styles.select} onClick={toggleDropdown}>
      <div className={styles.selected}>
        {selected === '' ? categoryPlaceholder : selected}
        <motion.span
          animate={isOpen ? 'open' : 'closed'}
          variants={variantsSpan}
        >
          {dropdownList(categoryArray)}
        </motion.span>
        <motion.img
          animate={isOpen ? 'open' : 'closed'}
          variants={variantsImg}
          className={styles.icon}
          src={arrowRight}
          alt="arrow icon"
        />
      </div>
    </div>
  )
}

export default CategorySelect
