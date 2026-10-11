
'use strict';

(() => {
  // Portfolio stories reflect the project descriptions already presented on the site.
  const books = [
    {
      id: 'nasa', title: 'Robotics for Another World', edition: 'NASA · 2026 · Robotics',
      subtitle: 'Lunar-dust testing in a high-vacuum environment',
      story: 'At NASA Marshall Space Flight Center, I investigated how a legacy robotic arm could support dust-mitigation testing. What started as a question about reach became a larger system problem involving geometry, mechanical limits, and the reality of operating inside a vacuum chamber.',
      challenge: 'Evaluate whether a robotic arm could meet test-surface access and chamber constraints.',
      approach: 'Study the kinematic workspace, assess actuator limitations, and organize verification across six operational scenarios and 34 system requirements.',
      tools: 'Robotics, Creo, systems engineering, verification planning, simulation.',
      outcome: 'A better understanding of how requirements, physics, and real hardware choices connect.',
      link: '#robot-lab', action: 'Explore the illustrative robot demo'
    },
    {
      id: 'iverify', title: 'IVerify', edition: 'Capstone · 2026 · Health technology',
      subtitle: 'A non-invasive IV occlusion detection concept',
      story: 'For my senior design capstone, I led a four-person team exploring whether an IV line could be monitored without placing new components inside the fluid path. Designing a useful response required thinking about electronics, sensing, the end user, and how information would be presented.',
      challenge: 'Identify a practical way to sense possible IV occlusion without interfering with the line.',
      approach: 'Coordinate system architecture and integrate the mechanical sensing concept, analog electronics, embedded supervision, and three-state indication.',
      tools: 'Systems integration, analog electronics, embedded systems, requirements and testing.',
      outcome: 'A multidisciplinary academic design concept, not an approved clinical product.',
      link: '#work', action: 'Return to the project summary'
    },
    {
      id: 'thermal', title: 'Thermal Controller & Logger', edition: '2025–2026 · Test automation',
      subtitle: 'Making temperature measurements easier to trust',
      story: 'I built tools to take repetitive engineering thermal tests and make them easier to monitor, compare, and document. The interesting part was not just collecting numbers, but helping engineers recognize stable conditions and produce repeatable reports.',
      challenge: 'Manual monitoring and inconsistent reporting slow down thermal validation.',
      approach: 'Combine Python data collection and live visualization with Arduino ambient control, stability tracking, and structured exports.',
      tools: 'Python, Arduino, Tkinter, temperature instrumentation, CSV and Excel.',
      outcome: 'A more traceable and repeatable thermal-testing workflow.',
      link: 'https://github.com/kalarcon775/Thermal-Logger', action: 'View Thermal Logger on GitHub'
    },
    {
      id: 'fingerprint', title: 'Fingerprint Authentication', edition: '2025 · Embedded systems',
      subtitle: 'A small system with meaningful communication challenges',
      story: 'This project brought an authentication concept onto an STM32 microcontroller. Beyond the biometric feature itself, I was interested in how the software organized users, stored templates, and communicated with the sensor.',
      challenge: 'Manage multiple users and fingerprint templates with reliable embedded communication.',
      approach: 'Build an STM32F767ZI system supporting four users, 24 templates, and two UART channels.',
      tools: 'STM32F767ZI, embedded C, UART, microcontroller programming.',
      outcome: 'Practical experience designing and debugging an embedded interface.',
      link: '#work', action: 'Return to the project summary'
    },
    {
      id: 'vna', title: 'Virtual Network Analyzer', edition: '2025 · RF measurements',
      subtitle: 'Turning RF measurements into readable engineering data',
      story: 'For this measurement project, I used software to connect calibration, data acquisition, and visualization. I liked that even careful RF work could become easier to examine and communicate through automation.',
      challenge: 'Automate two-port RF measurements while accounting for calibration errors.',
      approach: 'Control the measurement workflow in MATLAB, use 12-term SOLT calibration, and visualize S-parameters.',
      tools: 'MATLAB, two-port VNA, RF calibration, S-parameter visualization.',
      outcome: 'An automated analysis workflow covering 100 MHz to 6 GHz.',
      link: '#work', action: 'Return to the project summary'
    },
    {
      id: 'leg', title: '3-Link Leg Simulation', edition: 'GitHub · Robotics & controls',
      subtitle: 'Exploring how connected joints move together',
      story: 'I modeled a human leg as three connected links. Simulating a multi-joint system helped make the relationships among geometry, movement, and joint torque more tangible.',
      challenge: 'Represent motion and dynamics across the hip, knee, and ankle.',
      approach: 'Build a MATLAB/Simulink model and calculate joint positions, velocities, and torque.',
      tools: 'MATLAB, Simulink, kinematics, dynamics, Newton–Euler methods.',
      outcome: 'A simulation-based way to study how linked mechanisms behave.',
      link: 'https://github.com/kalarcon775/3link-sim', action: 'Open the 3-Link Sim repository'
    },
    {
      id: 'prodriver', title: 'ProDriver Sim', edition: 'GitHub · Electrical simulation',
      subtitle: 'Putting LED-driver behavior into a model',
      story: 'I wanted a tool that could connect electrical measurements with predictions. The simulation provides a way to compare driver and fixture behavior with observed bench results.',
      challenge: 'Estimate how electrical operating conditions affect an LED driver and fixture.',
      approach: 'Model voltage, current, load, and efficiency; compare predicted behavior with measurements.',
      tools: 'Python, PyQt6, electrical modeling, bench testing.',
      outcome: 'An engineering tool for comparing model behavior and measured values.',
      link: 'https://github.com/kalarcon775/ProDriver-Sim', action: 'Open the ProDriver Sim repository'
    },
    {
      id: 'huemotion', title: 'HueMotion', edition: 'GitHub · Human interaction',
      subtitle: 'Turning hand gestures into lighting responses',
      story: 'HueMotion explores what happens when a familiar action becomes an interface. By interpreting hand gestures from a webcam, the project connects human movement to responsive RGBW lighting.',
      challenge: 'Make gesture recognition useful for controlling lighting in an intuitive way.',
      approach: 'Track hands with MediaPipe and map gesture states to lighting controls and a browser preview.',
      tools: 'JavaScript, MediaPipe, Node.js, webcam tracking, RGBW lighting.',
      outcome: 'A gesture-driven prototype with an optional local Casambi bridge.',
      link: 'https://github.com/kalarcon775/HueMotion', action: 'Open HueMotion on GitHub'
    },
    {
      id: 'dmx', title: 'DMX Controller', edition: 'GitHub · Lighting control',
      subtitle: 'A browser interface connected to physical lights',
      story: 'This project brings a familiar browser interface to a hardware lighting-control problem. Choosing a scene or brightness setting produces commands for an Arduino-based DMX system.',
      challenge: 'Translate simple user controls into real output for RGBW lighting hardware.',
      approach: 'Use Flask to receive browser inputs and send serial commands to Arduino for DMX output.',
      tools: 'Python, Flask, Arduino, serial communication, DMX.',
      outcome: 'A direct connection between software controls and physical lighting response.',
      link: 'https://github.com/kalarcon775/DMX-Controller', action: 'Open the DMX Controller repository'
    }
  ];

  const dialog = document.getElementById('project-book-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const stage = document.getElementById('book-open-stage');
  const closeBtn = document.getElementById('close-project-book');
  const previous = document.getElementById('book-previous');
  const next = document.getElementById('book-next');
  const counter = document.getElementById('book-counter');
  const coverTitle = document.getElementById('book-cover-title');
  const detailLink = document.getElementById('book-project-link');
  const fields = {
    edition: document.getElementById('book-edition'),
    title: document.getElementById('book-modal-title'),
    subtitle: document.getElementById('book-modal-intro'),
    story: document.getElementById('book-story'),
    challenge: document.getElementById('book-challenge'),
    approach: document.getElementById('book-approach'),
    tools: document.getElementById('book-tools'),
    outcome: document.getElementById('book-outcome')
  };
  const bookButtons = [...document.querySelectorAll('[data-open-book]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selectedIndex = 0;
  let lastTrigger = null;
  let pullTimer = null;
  let openTimer = null;
  let turnTimer = null;
  let finishTurnTimer = null;
  let isOpening = false;
  let isTurning = false;

  function clearTimers() {
    [pullTimer, openTimer, turnTimer, finishTurnTimer].forEach(id => {
      if (id !== null) window.clearTimeout(id);
    });
    pullTimer = openTimer = turnTimer = finishTurnTimer = null;
  }

  function syncNavigation() {
    if (previous) previous.disabled = isOpening || isTurning || selectedIndex === 0;
    if (next) next.disabled = isOpening || isTurning || selectedIndex === books.length - 1;
  }

  // Project information is filled from trusted, authored text only.
  function renderBook(index) {
    if (index < 0 || index >= books.length) return;
    selectedIndex = index;
    const book = books[index];
    for (const [name, element] of Object.entries(fields)) {
      if (element) element.textContent = book[name];
    }
    if (detailLink) {
      detailLink.href = book.link;
      detailLink.textContent = book.action + (book.link.startsWith('http') ? ' ↗' : ' →');
      if (book.link.startsWith('http')) {
        detailLink.target = '_blank';
        detailLink.rel = 'noopener noreferrer';
      } else {
        detailLink.removeAttribute('target');
        detailLink.removeAttribute('rel');
      }
    }

    if (counter) counter.textContent = 'Book ' + (index + 1) + ' of ' + books.length;
    if (coverTitle) coverTitle.textContent = book.title;

    // Match the opening hardback cover to the selected spine.
    const spine = bookButtons.find(button => button.dataset.openBook === book.id);
    if (spine && stage) {
      const style = getComputedStyle(spine);
      stage.style.setProperty('--active-book-color', style.getPropertyValue('--spine').trim() || '#874861');
      stage.style.setProperty('--active-book-border', style.getPropertyValue('--spine-border').trim() || '#54354a');
    }
    syncNavigation();
  }

  function setBookStage(state) {
    if (!stage) return;
    stage.classList.remove('is-closed', 'is-opening', 'is-open', 'page-turn-next', 'page-turn-prev');
    stage.classList.add(state);
  }

  function beginOpening(index, trigger) {
    if (dialog.open || pullTimer !== null) return;
    clearTimers();
    lastTrigger = trigger;
    trigger.classList.add('is-pulling');
    isOpening = !reduceMotion.matches;
    isTurning = false;
    renderBook(index);
    setBookStage('is-closed');
    syncNavigation();

    // First pull the spine slightly out of the shelf. Then reveal a closed
    // hardcover that physically swings open on its center hinge.
    pullTimer = window.setTimeout(() => {
      trigger.classList.remove('is-pulling');
      dialog.showModal();
      dialog.scrollTop = 0;
      closeBtn?.focus();

      if (reduceMotion.matches) {
        isOpening = false;
        setBookStage('is-open');
        syncNavigation();
        return;
      }

      // Paint the closed cover before starting the opening transition.
      void stage?.offsetWidth;
      window.requestAnimationFrame(() => {
        if (!dialog.open) return;
        setBookStage('is-opening');
      });

      openTimer = window.setTimeout(() => {
        if (!dialog.open) return;
        isOpening = false;
        setBookStage('is-open');
        syncNavigation();
        openTimer = null;
      }, 1120);
      pullTimer = null;
    }, reduceMotion.matches ? 0 : 210);
  }

  function turnTo(index, direction) {
    if (!dialog.open || isOpening || isTurning || index < 0 || index >= books.length) return;

    if (reduceMotion.matches) {
      renderBook(index);
      dialog.scrollTop = 0;
      return;
    }

    isTurning = true;
    syncNavigation();
    stage?.classList.add(direction > 0 ? 'page-turn-next' : 'page-turn-prev');

    // Replace the book's text halfway through the paper's 3D turn.
    turnTimer = window.setTimeout(() => {
      renderBook(index);
      dialog.scrollTop = 0;
      turnTimer = null;
    }, 340);

    finishTurnTimer = window.setTimeout(() => {
      stage?.classList.remove('page-turn-next', 'page-turn-prev');
      isTurning = false;
      syncNavigation();
      finishTurnTimer = null;
    }, 760);
  }

  bookButtons.forEach(button => button.addEventListener('click', () => {
    const index = books.findIndex(book => book.id === button.dataset.openBook);
    if (index >= 0) beginOpening(index, button);
  }));

  bookButtons.forEach((button, index) => button.addEventListener('keydown', event => {
    let target = -1;
    if (event.key === 'ArrowRight') target = (index + 1) % bookButtons.length;
    else if (event.key === 'ArrowLeft') target = (index - 1 + bookButtons.length) % bookButtons.length;
    else if (event.key === 'ArrowDown') target = (index + 5) % bookButtons.length;
    else if (event.key === 'ArrowUp') target = (index - 5 + bookButtons.length) % bookButtons.length;
    if (target < 0) return;
    event.preventDefault();
    bookButtons[target].focus();
  }));

  closeBtn?.addEventListener('click', () => dialog.close());
  previous?.addEventListener('click', () => turnTo(selectedIndex - 1, -1));
  next?.addEventListener('click', () => turnTo(selectedIndex + 1, 1));

  detailLink?.addEventListener('click', () => {
    if (detailLink.getAttribute('href')?.startsWith('#')) {
      lastTrigger = null;
      dialog.close();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    clearTimers();
    isOpening = false;
    isTurning = false;
    stage?.classList.remove('page-turn-next', 'page-turn-prev');
    setBookStage('is-closed');
    bookButtons.forEach(button => button.classList.remove('is-pulling'));
    syncNavigation();
    lastTrigger?.focus();
    lastTrigger = null;
  });

  renderBook(0);
})();
