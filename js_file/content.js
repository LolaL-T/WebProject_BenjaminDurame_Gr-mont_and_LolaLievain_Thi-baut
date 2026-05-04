const carouselImages = [
      "../Image_files/image_cours_1.jpg",
      "../Image_files/image_cours_2.jpg",
    ];
    const carouselAlts = [
      "EFREI campus 1",
      "EFREI campus 2",
    ];

    let projCurrent = 0;
    let timechange = 5000;
    const carouselImage = document.getElementById("carousel-image");

    function slide(dir) {
      projCurrent = (projCurrent + dir + carouselImages.length) % carouselImages.length;
      carouselImage.src = carouselImages[projCurrent];
      carouselImage.alt = carouselAlts[projCurrent];
    }
    setInterval(() => {
      slide(1);
    }, timechange);