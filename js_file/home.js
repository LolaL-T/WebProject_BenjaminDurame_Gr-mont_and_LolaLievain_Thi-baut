// Load carousel data from JSON
    let carouselData = [];
    let timechange = 5000;
    let current = 0;
    let isAnimating = false;
    const duration = 1200;
    const carouselImage = document.getElementById("carousel-image");

    fetch('../js_file/data.json')
      .then(response => response.json())
      .then(data => {
        carouselData = data.homeCarousel;
      })

    function slide(dir) {
      if (isAnimating || carouselData.length === 0) return;
      isAnimating = true;

      const nextIndex = (current + dir + carouselData.length) % carouselData.length;
      const nextImg = document.createElement('img');
      nextImg.src = carouselData[nextIndex].src;
      nextImg.alt = carouselData[nextIndex].alt;
      nextImg.style.width = '100%';
      nextImg.style.height = '320px';
      nextImg.style.objectFit = 'cover';
      nextImg.style.display = 'block';
      nextImg.style.flexShrink = '0';
      nextImg.style.transition = `transform ${duration}ms ease-in-out`;

      const track = carouselImage.parentElement;
      carouselImage.style.transition = `transform ${duration}ms ease-in-out`;

      if (dir > 0) {
        nextImg.style.transform = 'translateX(0)';
        carouselImage.style.transform = 'translateX(0)';
        track.appendChild(nextImg);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            carouselImage.style.transform = 'translateX(-100%)';
            nextImg.style.transform = 'translateX(-100%)';
          });
        });
      } else {
        nextImg.style.transform = 'translateX(-100%)';
        carouselImage.style.transform = 'translateX(-100%)';
        track.insertBefore(nextImg, carouselImage);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            carouselImage.style.transform = 'translateX(0)';
            nextImg.style.transform = 'translateX(0)';
          });
        });
      }

      setTimeout(() => {
        carouselImage.style.transition = 'none';
        current = nextIndex;
        carouselImage.src = carouselData[current].src;
        carouselImage.alt = carouselData[current].alt;
        carouselImage.style.transform = 'translateX(0)';
        nextImg.remove();
        isAnimating = false;
      }, duration);
    }

    setInterval(() => {
      slide(1);
    }, timechange);