import type { Swiper as SwiperInstance } from 'swiper';
import type { SwiperEvents } from 'swiper/types';
import gsap from 'gsap';

type ModuleParams = {
  swiper: SwiperInstance;
  extendParams: (obj: Record<string, any>) => void;
  on: <E extends keyof SwiperEvents>(event: E, handler: SwiperEvents[E]) => void;
};

export const RoundPlugin: (p: ModuleParams) => void = ({ swiper, on }) => {
  const size = 56;
  const layout = () => {
    const radius = swiper.width / 2;
    const slides = Array.from(swiper.slides) as HTMLElement[];
    const count = slides.length;
    const desiredAngle = 60; // 360 / count;

    slides.forEach((slide, i) => {
      const half = size / 2;
      const angle = -(360 / count) * i + desiredAngle;
      const x = radius * Math.cos((angle * Math.PI) / 180) - half;
      const y = radius * Math.sin((angle * Math.PI) / 180) + half;
      slide.style.width = 'auto';
      slide.style.flex = 'none';
      slide.style.width = `${size}px`;
      slide.style.height = `${size}px`;
      slide.style.position = 'absolute';
      slide.style.left = `calc(50% + ${x}px)`;
      slide.style.top = `calc(50% - ${y}px )`;
      slide.style.transformOrigin = 'center center';
    });
  };

  const rotateTo = (index: number, animate = true) => {
    const count = swiper.slides.length;
    if (!count) return;
    const anglePerSlide = 360 / count;
    const slideAngle = index * anglePerSlide;
    const targetAngle = 0 - slideAngle;
    swiper.wrapperEl.style.transition = animate ? 'transform 0.6s ease' : 'none';
    swiper.wrapperEl.style.transform = `rotate(${targetAngle}deg)`;

    const slides = Array.from(swiper.slides) as HTMLElement[];
    slides.forEach((slide) => {
      slide.style.width = 'auto';
      slide.style.flex = 'none';
      slide.style.width = `${size}px`;
      slide.style.height = `${size}px`;
      const item = slide.querySelector('.round__item') as HTMLElement;

      if (item) {
        item.style.transform = `rotate(${slideAngle}deg)`;
      }
      slide.style.transition = animate ? 'transform 0.6s ease' : 'none';
    });
  };

  const setupHoverAnimations = () => {
    const slides = Array.from(swiper.slides) as HTMLElement[];

    slides.forEach((slide) => {
      const dot = slide.querySelector('.round__item') as HTMLElement;

      if (!dot) return;

      dot.onmouseenter = null;
      dot.onmouseleave = null;

      dot.addEventListener('mouseenter', () => {
        if (!swiper?.slides) return;
        const slidesArray = Array.from(swiper.slides) as HTMLElement[];
        const currentIndex = slidesArray.indexOf(slide);
        if (currentIndex === swiper.activeIndex) return;
        gsap.to(dot, {
          duration: 0.6,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: '#f4f5f9',
          ease: 'power2.out',
        });
      });

      dot.addEventListener('mouseleave', () => {
        if (!swiper?.slides) return;
        const slidesArray = Array.from(swiper.slides) as HTMLElement[];
        const currentIndex = slidesArray.indexOf(slide);
        if (currentIndex === swiper.activeIndex) return;
        gsap.to(dot, {
          duration: 0.4,
          width: 6,
          height: 6,
          backgroundColor: '#42567a',
          ease: 'power2.inOut',
        });
      });
    });
  };

  const animateActive = (activeIndex: number) => {
    const slides = Array.from(swiper.slides) as HTMLElement[];
    slides.forEach((slide, i) => {
      const dot = slide.querySelector('.round__item') as HTMLElement;
      const label = slide.querySelector('.label') as HTMLElement;
      const isActive = i === activeIndex;

      if (isActive) {
        dot.classList.remove('dot');

        gsap.to(dot, {
          duration: 0.6,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: '#f4f5f9',
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(label, {
              duration: 0.5,
              opacity: 1,
              x: 0,
              ease: 'power2.out',
            });
          },
        });
      } else {
        dot.classList.add('dot');
        gsap.to(dot, {
          duration: 0.4,
          width: 6,
          height: 6,
          backgroundColor: '#42567a',
          ease: 'power2.inOut',
        });

        gsap.to(label, {
          duration: 0.3,
          opacity: 0,
          x: 0,
          ease: 'power2.inOut',
        });
      }
    });
  };

  on('slideChangeTransitionStart', () => {
    if (window.innerWidth < 992) return;
    animateActive(swiper.activeIndex);
  });

  on('init', () => {
    if (window.innerWidth < 992) return;
    animateActive(swiper.activeIndex);
    setupHoverAnimations();
    swiper.el.style.overflow = 'visible';
    swiper.wrapperEl.style.transform = 'none';
    swiper.wrapperEl.style.display = 'block';
    swiper.wrapperEl.style.position = 'relative';
    layout();
  });

  on('click', (sw) => {
    if (window.innerWidth < 992) return;
    if (sw.clickedIndex != null) {
      sw.slideTo(sw.clickedIndex);
    }
  });

  on('slideChange', () => {
    if (window.innerWidth < 992) return;
    rotateTo(swiper.activeIndex, true);
  });

  on('setTranslate', () => {
    if (window.innerWidth < 992) return;
    layout();
  });

  on('destroy', () => {
    swiper.slides.forEach((slide: HTMLElement) => {
      slide.style.transform = '';
      slide.style.left = '';
      slide.style.top = '';
      slide.style.position = '';
      slide.style.width = '';
      slide.style.height = '';
    });
    swiper.wrapperEl.style.transform = '';
    swiper.wrapperEl.style.transition = '';
  });
};
