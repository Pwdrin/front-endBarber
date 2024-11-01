import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards";

import { EffectCards } from "swiper/modules";

export default function CardsSlide() {
  return (
    <div className="flex justify-center items-center h-80">
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
        style={{ width: "240px", height: "320px" }}
      >
        <SwiperSlide
          className="flex justify-center items-center rounded-2xl text-2xl font-bold text-white"
          style={{ backgroundColor: "rgb(0, 140, 255)" }}
        >
          Slide 1
        </SwiperSlide>
        <SwiperSlide
          className="flex justify-center items-center rounded-2xl text-2xl font-bold text-white"
          style={{ backgroundColor: "rgb(0, 140, 255)" }}
        >
          Slide 2
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
