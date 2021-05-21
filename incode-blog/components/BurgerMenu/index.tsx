import cx from 'classnames'
import styles from './BurgerMenu.module.scss'

type BurgerMenuProps = {
  handleNavbar: (e: any) => void
  navbarState: boolean
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({
  handleNavbar,
  navbarState,
}: BurgerMenuProps) => {
  return (
    <div
      className={cx(styles.burger_menu, {
        [styles.opened]: navbarState,
      })}
      onClick={handleNavbar}
    >
      <div className={styles.burger} />
    </div>
  )
}

export default BurgerMenu
