import styles from './style.module.scss';
import { AnimatedNumber } from './animatedNumber';
import clsx from 'clsx';

type Props = {
  from: number;
  to: number;
};

export const Years = ({ from, to }: Props) => {
  return (
    <div className={styles.wrapper}>
      <AnimatedNumber className={styles.text} to={from} duration={1} />{' '}
      <AnimatedNumber className={clsx(styles.text, styles.text__pink)} to={to} duration={1} />
    </div>
  );
};
