import styles from './Container.module.scss'

type ContainerProps = {
  children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }: ContainerProps) => (
  <div className={styles.container}>{children}</div>
)

export default Container
