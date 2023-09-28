import "./App.css";
import Carousel from "./components/Carousel";

function App() {
  const carouselImages = [
    "https://images.pexels.com/photos/15347387/pexels-photo-15347387/free-photo-of-a-dog-in-close-up-shot.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/333083/pexels-photo-333083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://www.youtube.com/watch?v=JkPUS0Zdwd8",
    "https://player.vimeo.com/video/867162326",
  ]
  return ( 
    <>
      <h1>SwiperJS React Carousel</h1>
      <div className="app">
        <Carousel>
        {carouselImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={'carousel-image'}
          />
        ))}
        </Carousel>
      </div>
    </>
  );
}

export default App;
