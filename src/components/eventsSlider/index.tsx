import { useRef, useState, useEffect, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './style.module.scss';
import { ArrowIcon } from '../../assets';
import clsx from 'clsx';
import { Navigation } from 'swiper/modules';
import { gsap } from 'gsap';

type Data = {
  title: number;
  description: string;
};

type Props = {
  data: Data[];
};

const EventsSlider = ({ data }: Props) => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [swiper, setSwiper] = useState<any>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    if (swiper) {
      swiper.slideTo(0, 0);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sliderRef!.current!.querySelectorAll(`.${styles.swiper__slide}`),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          duration: 2,
          ease: 'power2.out',
        },
      );
    }, sliderRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <div className={styles.wrapper} ref={sliderRef}>
      <button ref={prevRef} className={clsx(styles.swiper__button, styles['swiper__button--left'])}>
        <ArrowIcon />
      </button>
      <button ref={nextRef} className={styles.swiper__button}>
        <ArrowIcon />
      </button>
      <Swiper
        slidesPerView={'auto'}
        onSwiper={setSwiper}
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          767: {
            spaceBetween: 80,
          },
          320: {
            spaceBetween: 25,
          },
        }}
        className={styles.swiper}>
        {data.map((tab) => (
          <SwiperSlide key={tab.title} className={styles.swiper__slide}>
            <div className={styles.slide}>
              <h4 className={styles.slide__title}>{tab.title}</h4>
              <p className={styles.slide__text}>{tab.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default memo(EventsSlider);
