import { useRef, useState } from 'react'
import cx from 'classnames'
import styles from './Dropdown.module.scss'
import arrowIcon from '~/public/images/icon-arrow.svg'
type DropdownProps = {
  dropdownPlaceholder: string
  dropdownArray: string[]
  handleDropdownSelect: (selected: string) => void
}

const Dropdown: React.FC<DropdownProps> = ({
  dropdownPlaceholder,
  dropdownArray,
  handleDropdownSelect,
}: DropdownProps) => {
  const [active, setActive] = useState('')
  const [selected, setSelected] = useState('')
  const [height, setHeight] = useState('0px')
  const [open, setOpen] = useState(false)
  const content = useRef(null)

  const toggleDropdown = () => {
    setActive(active === '' ? 'active' : '')
    setHeight(active === 'active' ? '0px' : `${content.current.scrollHeight}px`)
    setOpen(!open)
  }

  const handleSelected = (e, i) => {
    const val = e.currentTarget.textContent
    setSelected(val)
    handleDropdownSelect(i)
    setOpen(false)
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
      <div
        className={styles.list}
        ref={content}
        style={{ maxHeight: `${height}` }}
      >
        {list}
      </div>
    )
  }
  return (
    <div
      className={cx(styles.dropdown, { [styles.active]: active })}
      onClick={toggleDropdown}
    >
      <div className={styles.selected}>
        {selected === '' ? dropdownPlaceholder : selected}
        <img
          className={cx(styles.icon, { [styles.rotate]: open })}
          src={arrowIcon}
          alt="arrow icon"
        />
      </div>
      {dropdownList(dropdownArray)}
    </div>
  )
}

export default Dropdown
