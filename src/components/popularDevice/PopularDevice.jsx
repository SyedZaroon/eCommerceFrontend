import React, { useEffect, useState } from 'react'
import styles from './popularDevice.module.css'
import Label from '../labels/Label'


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import GreaterThan from '../../assets/icons/GreaterThan'
import LessThan from "../../assets/icons/LessThan";
import { NavLink } from 'react-router-dom'
import { getAllProducts } from '../../services/product'
import IconButton from '../iconButton/Iconbutton';


const PopularDevice = () => {
    const [popularProducts, setPopularProducts] = useState([]);

    useEffect(()=>{
      const fetchprducts = async ()=>{
        const data = await getAllProducts();
        setPopularProducts(data.products)
      }

      fetchprducts();
    },[])
  return (
    <div className={styles["popular-width"]}>
      <h2 className={styles["popular-heading"]}>Popular Devices Right Now</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={80}
        slidesPerView={1}
        navigation={{
          nextEl: ".custom-swiper-button-next",
          prevEl: ".custom-swiper-button-prev",
        }}
        // autoplay={{ delay: 3000 }}
        className={styles["popular-component"]}
        breakpoints={{
          320: { slidesPerView: 1.1 },
          336: { slidesPerView: 1.6 },
          400: { slidesPerView: 1.8 },
          450: { slidesPerView: 2 },
          550: { slidesPerView: 2.5 },
          600: { slidesPerView: 3 },
          800: { slidesPerView: 3.5 },
          900: { slidesPerView: 4 },
          1000: { slidesPerView: 4.5 },
          1100: { slidesPerView: 5 },
          1200: { slidesPerView: 5.3 },
          1220: { slidesPerView: 5.5 },
          1300: { slidesPerView: 6 },
        }}
      >
        {popularProducts.map((value) => {
          return (
            <SwiperSlide key={value._id}>
              <NavLink to={`/product/${value.slug}`} >
                <div className={styles["popular-box"]}>
                    <img src={value.productImg} width="200px" />
                    <Label
                      size="md"
                      className={styles["popualr-label"]}
                      success={true}
                      text="popular"
                    />
                  <div className={styles["popular-content"]}>
                    <p className={styles["popular-title"]}>{value.title}</p>
                    <p className={styles["popular-price"]}>
                      <span className={styles["price"]}> £{value.discountPrice}</span>
                    </p>
                  </div>
                </div>
              </NavLink>
            </SwiperSlide>
          );
        })}
        <div className={`${styles["prev-btn"]} `}>
          {
            <IconButton
              className="custom-swiper-button-prev"
              size="2xs"
              icon={<LessThan />}
            />
          }
        </div>
        <div className={`${styles["next-btn"]} `}>
          {
            <IconButton
              className="custom-swiper-button-next"
              size="2xs"
              icon={<GreaterThan />}
            />
          }
        </div>
      </Swiper>
    </div>
  );
}

export default PopularDevice