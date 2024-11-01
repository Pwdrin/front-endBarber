import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-coverflow";

function Slide() {
  const [slidePerview, setSlidePerView] = useState(1);
  const data = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];

  return (
    <div className="container mx-auto p-4">
      <Swiper
        modules={[EffectCoverflow, Navigation, Pagination]}
        effect="coverflow"
        slidesPerView={slidePerview}
        pagination={{ clickable: true }}
        navigation
        className="my-4"
      >
        {data.map((item) => (
          <SwiperSlide
            key={item.id}
            className="flex justify-center items-center bg-blue-600 h-80 w-80"
          >
            <div className="text-white text-2xl">Slide {item.id}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Slide;
