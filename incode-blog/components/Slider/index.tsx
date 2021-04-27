import React, { isValidElement, useEffect } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

type SliderProps = {
  children: React.ReactNode
  numberOfSlides?: number
  slidesSpacing?: number
  slidesMode?: 'snap' | 'free' | 'free-snap'
  isCentered?: boolean
  isLooped?: boolean
}

const Slider: React.FC<SliderProps> = ({
  children,
  numberOfSlides = 3,
  slidesSpacing = 10,
  slidesMode,
  isCentered,
  isLooped,
}: SliderProps) => {
  const [ref, slider] = useKeenSlider<HTMLDivElement>({
    slidesPerView: numberOfSlides,
    spacing: slidesSpacing,
    mode: slidesMode,
    centered: isCentered,
    loop: isLooped,
  })
  useEffect(() => {
    setTimeout(() => {
      if (slider) slider.resize()
    }, 1000)
  })

  return (
    <div ref={ref} className="keen-slider">
      {React.Children.map(children, child => {
        if (isValidElement(child)) {
          return {
            ...child,
            props: {
              ...child.props,
              className: `${
                child.props.className ? `${child.props.className} ` : ''
              }keen-slider__slide`,
            },
          }
        }
        return child
      })}
    </div>
  )
}

export default Slider
