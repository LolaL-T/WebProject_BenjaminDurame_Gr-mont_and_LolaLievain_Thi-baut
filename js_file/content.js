    let projectData = [];
    let coursesData = [];
    let timechange = 5000;
    let current = 0;
    let isAnimating = false;    
    const dayBodies = document.querySelectorAll('.day-body');
    const dayBodyHeight = 480; 
    const hoursRange = 18;
    const startHour = 8;
    const pixelsPerHour = dayBodyHeight / hoursRange;
    const duration = 1200;
    const projectImage = document.getElementById("project-image");
    const track = document.querySelector('.project-track');
    const modal = document.getElementById('popup-project');
    const modalTitle = document.getElementById('popup-project-title');
    const modalDescription = document.getElementById('popup-project-description');
    const modalClose = document.getElementById('popup-project-close');
    const modalBackdrop = document.getElementById('popup-project-backdrop');
    const courseModal = document.getElementById('popup-course');
    const courseModalClose = document.getElementById('popup-course-close');
    const courseModalBackdrop = document.getElementById('popup-course-backdrop');
    const courseModalTitle = document.getElementById('popup-course-title');
    const courseModalTime = document.getElementById('popup-course-time');
    const courseModalDate = document.getElementById('popup-course-date');
    const courseModalRoom = document.getElementById('popup-course-room');
    const courseModalTeacher = document.getElementById('popup-course-teacher');
    const courseModalTeams = document.getElementById('popup-course-teams');
    
    fetch('../js_file/data.json')
      .then(response => response.json())
      .then(data => {
        projectData = data.projectCarousel;
        coursesData = data.courses;
        generateCourseCards();
      })
      .catch(err => console.error('Error loading data:', err));

    function generateCourseCards() {
      const scheduleGrid = document.querySelector('.schedule-grid');
      if (!scheduleGrid) return;

      const existingCards = document.querySelectorAll('.course-card');
      existingCards.forEach(card => card.remove());


      const courseSchedule = {
        0: [0], // Monday
        1: [1], // Tuesday
        2: [2], // Wednesday
        3: [],  // Thursday
        4: [3, 4] // Friday
      };

      function getHourFromTime(timeStr) {
        return parseInt(timeStr.split(':')[0]);
      }



      dayBodies.forEach((dayBody, dayIndex) => {
        const courseIndices = courseSchedule[dayIndex] || [];
        
        courseIndices.forEach((courseIndex) => {
          if (courseIndex >= coursesData.length) return;
          
          const course = coursesData[courseIndex];
          const courseHour = getHourFromTime(course.hour);
          const topPosition = (courseHour - startHour) * pixelsPerHour;
          
          const card = document.createElement('div');
          card.className = 'course-card';
          card.dataset.courseName = course.name;
          card.dataset.date = course.date;
          card.dataset.hour = course.hour;
          card.dataset.room = course.room;
          card.dataset.teacher = course.teacher;
          card.dataset.teamsLink = course.teamsLink;
          card.style.top = topPosition + 'px';
          card.onclick = function() { openCourseModal(this); };
          
          card.innerHTML = `
            <div class="course-name">${course.name}</div>
            <div class="course-room">Salle : ${course.room}</div>
          `;
          
          dayBody.appendChild(card);
        });
      });
    }

    function openProjectModal() {
      const project = projectData[current];
      if (!project) return;
      
      modalTitle.textContent = project.title;
      const pdfLinksMarkup = project.pdfs
        .map((file) => `<li><a href="${file.href}" target="_blank" rel="noopener noreferrer">${file.label}</a></li>`)
        .join('');
      modalDescription.innerHTML = `${project.description}<div class="popup-pdfs"><p>PDF files:</p><ul>${pdfLinksMarkup}</ul></div>`;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeProjectModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }

    projectImage.addEventListener('click', openProjectModal);
    modalClose.addEventListener('click', closeProjectModal);
    modalBackdrop.addEventListener('click', closeProjectModal);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeProjectModal();
      }
    });

    function projectSlide(dir) {
      if (isAnimating || projectData.length === 0) return;
      isAnimating = true;

      const nextIndex = (current + dir + projectData.length) % projectData.length;
      const nextImg = document.createElement('img');
      nextImg.src = projectData[nextIndex].src;
      nextImg.alt = projectData[nextIndex].alt;
      nextImg.style.width = '100%';
      nextImg.style.height = '400px';
      nextImg.style.objectFit = 'cover';
      nextImg.style.display = 'block';
      nextImg.style.flexShrink = '0';
      nextImg.style.transition = `transform ${duration}ms ease-in-out`;

      projectImage.style.transition = `transform ${duration}ms ease-in-out`;

      if (dir > 0) {
        nextImg.style.transform = 'translateX(0)';
        projectImage.style.transform = 'translateX(0)';
        track.appendChild(nextImg);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            projectImage.style.transform = 'translateX(-100%)';
            nextImg.style.transform = 'translateX(-100%)';
          });
        });
      } else {
        nextImg.style.transform = 'translateX(-100%)';
        projectImage.style.transform = 'translateX(-100%)';
        track.insertBefore(nextImg, projectImage);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            projectImage.style.transform = 'translateX(0)';
            nextImg.style.transform = 'translateX(0)';
          });
        });
      }

      setTimeout(() => {
        projectImage.style.transition = 'none';
        current = nextIndex;
        projectImage.src = projectData[current].src;
        projectImage.alt = projectData[current].alt;
        projectImage.style.transform = 'translateX(0)';
        nextImg.remove();
        isAnimating = false;
      }, duration);
    }

    setInterval(() => {
      projectSlide(1);
    }, timechange);

    function openCourseModal(element) {
      const courseName = element.dataset.courseName;
      const date = element.dataset.date;
      const hour = element.dataset.hour;
      const room = element.dataset.room;
      const teacher = element.dataset.teacher;
      const teamsLink = element.dataset.teamsLink;

      courseModalTitle.textContent = courseName;
      courseModalTime.textContent = hour;
      courseModalDate.textContent = date;
      courseModalRoom.textContent = `Room: ${room}`;
      courseModalTeacher.textContent = `Teacher: ${teacher}`;
      courseModalTeams.href = teamsLink;

      courseModal.classList.add('show');
      courseModal.setAttribute('aria-hidden', 'false');
    }

    function closeCourseModal() {
      courseModal.classList.remove('show');
      courseModal.setAttribute('aria-hidden', 'true');
    }

    courseModalClose.addEventListener('click', closeCourseModal);
    courseModalBackdrop.addEventListener('click', closeCourseModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && courseModal.classList.contains('show')) {
        closeCourseModal();
      }
    });
