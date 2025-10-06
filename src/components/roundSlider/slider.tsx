import { useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { EffectFade } from 'swiper/modules';
import { RoundPlugin } from './module';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ArrowIcon } from '../../assets';
import { data } from './data';
import { Years } from '../years';
import EventsSlider from '../eventsSlider';

const slides = data.map((item) => item.name);

function useIsLarge(breakpoint = 992) {
  const [isLarge, setIsLarge] = useState(() => window.innerWidth >= breakpoint);
  useEffect(() => {
    const m = () => setIsLarge(window.innerWidth >= breakpoint);
    window.addEventListener('resize', m);
    return () => window.removeEventListener('resize', m);
  }, [breakpoint]);
  return isLarge;
}

export default function Slider() {
  const isLarge = useIsLarge(992);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [swiper, setSwiper] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  const modules = useMemo(
    () => (isLarge ? [RoundPlugin, Navigation, Pagination] : [EffectFade, Navigation, Pagination]),
    [isLarge],
  );

  const key = isLarge ? 'large' : 'small';

  useEffect(() => {
    if (!swiper) return;
    const prevEl = prevRef.current;
    const nextEl = nextRef.current;
    if (prevEl && nextEl && swiper.params?.navigation) {
      swiper.params.navigation.prevEl = prevEl;
      swiper.params.navigation.nextEl = nextEl;
      try {
        swiper.navigation.destroy();
      } catch {}
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [swiper, key]);

  return (
    <>
      <div className="animation-wrap">
        <Years
          from={data[currentSlide - 1].dates[0].title}
          to={data[currentSlide - 1].dates[data[currentSlide - 1].dates.length - 1].title}
        />
        <div className="round">
          <Swiper
            key={key}
            modules={modules}
            onSwiper={setSwiper}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onSlideChange={(sw) => {
              setCurrentSlide(sw.realIndex + 1);
            }}
            pagination={{
              el: paginationRef.current,
              clickable: true,
            }}
            effect={isLarge ? 'slide' : 'fade'}
            allowTouchMove={!isLarge ? true : false}
            slidesPerView={1}
            className="round-swiper"
            onClick={(s) => {
              if (s.clickedIndex != null) s.slideTo(s.clickedIndex);
            }}>
            {slides.map((s, i) => (
              <SwiperSlide key={s}>
                <div className="round__item ">
                  <span>{i + 1}</span>
                  <div className="label">{s}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="bottom">
        <div className="round-bottom">
          <div className="round-bottom__inner">
            <div className="round-fraction">
              0{currentSlide}/0{slides.length}
            </div>
            <div className="round-nav">
              <button ref={prevRef} className="round__button round__button--left">
                <ArrowIcon />
              </button>
              <button ref={nextRef} className="round__button">
                <ArrowIcon />
              </button>
            </div>
          </div>
          <div ref={paginationRef} className="round-pagination" />
        </div>
        <EventsSlider data={data[currentSlide - 1].dates} />
      </div>
    </>
  );
}
