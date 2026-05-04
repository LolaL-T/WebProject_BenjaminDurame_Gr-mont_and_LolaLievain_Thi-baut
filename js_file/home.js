const carouselImages = [
      "../Image_files/image_cours_1.jpg",
      "../Image_files/image_cours_2.jpg",
    ];
    const carouselAlts = [
      "EFREI campus 1",
      "EFREI campus 2",
    ];

    let timechange = 5000;
    let current = 0;
    const carouselImage = document.getElementById("carousel-image");

    function slide(dir) {
        const nextIndex = (current + dir + carouselImages.length) % carouselImages.length;
        const nextImg = document.createElement('img');
        nextImg.src = carouselImages[nextIndex];
        nextImg.alt = carouselAlts[nextIndex];
        nextImg.style.width = '100%';
        nextImg.style.height = '320px';
        nextImg.style.objectFit = 'cover';
        nextImg.style.display = 'block';
        nextImg.style.flexShrink = '0';
        nextImg.style.transition = 'transform 1200ms ease-in-out';
      
        const track = carouselImage.parentElement;
        carouselImage.style.transition = 'transform 1200ms ease-in-out';
        track.appendChild(nextImg);
      
        const slideDistance = dir > 0 ? '-100%' : '100%';
        carouselImage.style.transform = `translateX(${slideDistance})`;
        nextImg.style.transform = `translateX(${slideDistance})`;
      
        setTimeout(() => {
            carouselImage.style.transition = 'none';
            current = nextIndex;
            carouselImage.src = carouselImages[current];
            carouselImage.alt = carouselAlts[current];
            carouselImage.style.transform = 'translateX(0)';
            nextImg.remove();
      }, 1200);
    }

    setInterval(() => {
      slide(1);
    }, timechange);