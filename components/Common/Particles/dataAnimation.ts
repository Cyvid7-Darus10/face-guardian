export const defaultAnimation: any = {
  fullScreen: {
    enable: false,
  },
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 1200,
      },
    },
    color: {
      value: ['#9fdbfd', '#5f9cbf', '#DDF3FF'],
    },
    opacity: {
      value: 1,
      random: false,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0,
        sync: false,
        loop: false,
      },
    },
    size: {
      value: 4,
      random: true,
      anim: {
        enable: false,
        speed: 3,
        size_min: 0,
        sync: true,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: {
        value: ['#9fdbfd'],
      },
      opacity: 1,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: 'none',
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse',
      },
      onclick: {
        enable: true,
        mode: 'grab',
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 1,
        },
      },
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
};
