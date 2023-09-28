<div className="swiper-container thumbs-slider">
<div className="swiper-wrapper">
  {React.Children.map(children, (child, index) => (
    <div className="swiper-slide">{child}</div>
  ))}
</div>
</div>