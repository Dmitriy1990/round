import React from 'react';
import styles from './style.module.scss';

type Props = {
  title: string;
};

export const Heading = ({ title }: Props) => {
  return <h2 className={styles.h2}>{title}</h2>;
};
