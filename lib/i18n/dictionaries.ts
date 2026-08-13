export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  rating?: number;
}

export interface Dictionary {
  header: {
    panelAdmin: string;
    biblioteca: string;
    salir: string;
    ingresar: string;
    registrarse: string;
  };
  hero: {
    titlePre: string;
    titleHighlight: string;
    titlePost: string;
    ctaLibrary: string;
    ctaRegister: string;
    ctaLogin: string;
  };
  intro: {
    eyebrow: string;
    title: string;
    subheading: string;
    paragraph: string;
    tags: string;
  };
  experience: {
    title: string;
    items: { title: string; desc: string }[];
  };
  quote: {
    text: string;
    attribution: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Testimonial[];
  };
  gallery: {
    title: string;
    subtitle: string;
  };
  memberTeaser: {
    eyebrow: string;
    title: string;
    paragraph: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  proximosRetiros: {
    eyebrow: string;
    title: string;
    cta: string;
    verMas: string;
    dateLocale: string;
  };
  ctaFinal: {
    eyebrow: string;
    title: string;
    paragraph: string;
    ctaJoin: string;
    ctaLogin: string;
    ctaLibrary: string;
  };
  footer: {
    rights: string;
  };
  languageSwitcher: {
    label: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    header: {
      panelAdmin: "Panel Admin",
      biblioteca: "Biblioteca",
      salir: "Salir",
      ingresar: "Ya soy parte",
      registrarse: "Quiero vivirlo",
    },
    hero: {
      titlePre: "Un espacio para sentir, ",
      titleHighlight: "sanar",
      titlePost: " y crecer",
      ctaLibrary: "Ir a mi biblioteca",
      ctaRegister: "Quiero vivirlo",
      ctaLogin: "Ya soy parte",
    },
    intro: {
      eyebrow: "Qué es Zentir",
      title: "Una invitación a vivir con propósito y sentir de verdad.",
      subheading: "Viajes con propósito",
      paragraph:
        "Experiencias presenciales y virtuales para moverte, conectar y transformarte desde un lugar más consciente.",
      tags: "Movimiento · Conexión · Transformación",
    },
    experience: {
      title: "Qué vives en Zentir",
      items: [
        {
          title: "Movimiento consciente",
          desc: "Clases guiadas para todos los niveles. Un método creado por Maricoles que busca despertar tu energía, abrir el corazón y fortalecer el cuerpo. La combinación de todas, y ninguna disciplina.",
        },
        {
          title: "Comunidad genuina",
          desc: "Espacios para compartir, conversaciones profundas y encuentros que nos permiten conectar de verdad y crear vínculos que trascienden la experiencia.",
        },
        {
          title: "Transformación",
          desc: "Experiencias que te invitan a mirarte hacia dentro, cuestionarte y llevarte herramientas tangibles que transforman tu manera de vivir, sentir y relacionarte contigo.",
        },
      ],
    },
    quote: {
      text: "El retiro me dio permiso de parar, de sentir y de volver a ser yo.",
      attribution: "— Participante Zentir 2024",
    },
    testimonials: {
      title: "Créanles a ellas, no a nosotros",
      subtitle:
        "Las experiencias de quienes se han unido a Zentir son nuestra columna vertebral. Su crecimiento personal es el pulso que nos mantiene vivos.",
      items: [
        {
          quote:
            "Me encantó el retiro en Puerto Escondido por la casa, la comida y, obviamente, la gente. Pero el primero en La Paz también fue muy especial. Y el segundo, aunque éramos menos personas, también fue especial porque mi mamá estuvo ahí.",
          name: "Arantza Estrada",
          rating: 5,
        },
        {
          quote:
            "Zentir es un viaje que me marcó profundamente. Un antes y un después en mi vida. Una experiencia inolvidable, llena de buena energía, amistades significativas y herramientas muy especiales.",
          name: "Eloisa Martin",
          rating: 5,
        },
        {
          quote:
            "La actividad de la niña interior fue muy especial. La última cena en Lanzarote, la compañía y la comida fueron lo mejor.",
          name: "Aleida",
          rating: 5,
        },
        {
          quote:
            "Regreso a casa con el corazón lleno y feliz. Cada minuto compartido, cada risa, cada lágrima, cada historia: los voy a atesorar para siempre. ¡Gracias! Espero que sigamos en contacto y que nuestros caminos se crucen muchas veces más.",
          name: "Lucia Denevi",
          role: "Fundadora, House of Mats",
          rating: 5,
        },
        {
          quote:
            "Gracias María y Lore. Por favor no dejen de organizar retiros: de verdad están haciendo la diferencia en la vida de muchas personas.",
          name: "María Prieto",
          role: "Fundadora, Puerto by María",
          rating: 5,
        },
        {
          quote:
            "Experiencia inolvidable e increíble. Gracias por el esfuerzo y los detalles hermosos que marcaron la diferencia.",
          name: "Laura Acevedo",
          rating: 5,
        },
        {
          quote:
            "El taller más revelador es el de nuestras heridas y máscaras. Siempre es relevante y nunca pasa de moda. El sello de Zentir.",
          name: "Sandra Granero",
          role: "Directora Global, IQOS",
        },
      ],
    },
    gallery: {
      title: "Momentos que se quedaron",
      subtitle: "Galería de experiencias Zentir",
    },
    memberTeaser: {
      eyebrow: "Zentir Studio",
      title: "Zentir a tu manera",
      paragraph: "Prácticas, meditaciones y herramientas para volver a ti, estés donde estés.",
      ctaPrimary: "Quiero entrar",
      ctaSecondary: "Ya soy parte",
    },
    proximosRetiros: {
      eyebrow: "Agenda",
      title: "Próximos retiros",
      cta: "Quiero anotarme",
      verMas: "Ver más",
      dateLocale: "es-MX",
    },
    ctaFinal: {
      eyebrow: "Ven a Zentir",
      title: "Únete a nuestra comunidad",
      paragraph:
        "Zentir lo creamos entre todos. Recibe inspiración, descubre nuestras próximas experiencias y construyamos juntos lo que sigue.",
      ctaJoin: "Quiero ser parte",
      ctaLogin: "Ya tengo cuenta",
      ctaLibrary: "Ir a mi biblioteca",
    },
    footer: {
      rights: "Todos los derechos reservados.",
    },
    languageSwitcher: {
      label: "Idioma",
    },
  },
  en: {
    header: {
      panelAdmin: "Admin Panel",
      biblioteca: "Library",
      salir: "Log out",
      ingresar: "I'm already part of it",
      registrarse: "I want in",
    },
    hero: {
      titlePre: "A space to feel, ",
      titleHighlight: "heal",
      titlePost: " and grow",
      ctaLibrary: "Go to my library",
      ctaRegister: "I want in",
      ctaLogin: "I'm already part of it",
    },
    intro: {
      eyebrow: "What is Zentir",
      title: "An invitation to live with purpose and truly feel.",
      subheading: "Journeys with purpose",
      paragraph:
        "In-person and virtual experiences to move, connect and transform from a more conscious place.",
      tags: "Movement · Connection · Transformation",
    },
    experience: {
      title: "What you live in Zentir",
      items: [
        {
          title: "Conscious movement",
          desc: "Guided classes for every level. A method created by Maricoles that seeks to awaken your energy, open your heart and strengthen your body. The combination of all disciplines, and none of them.",
        },
        {
          title: "Genuine community",
          desc: "Spaces to share, deep conversations and encounters that let us connect for real and build bonds that go beyond the experience.",
        },
        {
          title: "Transformation",
          desc: "Experiences that invite you to look within, question yourself, and take home tangible tools that transform the way you live, feel and relate to yourself.",
        },
      ],
    },
    quote: {
      text: "The retreat gave me permission to stop, to feel, and to become myself again.",
      attribution: "— Zentir participant, 2024",
    },
    testimonials: {
      title: "Believe them, not us",
      subtitle:
        "The experiences of those who've joined Zentir are our backbone. Their personal growth is the pulse that keeps us alive.",
      items: [
        {
          quote:
            "I loved the one in Puerto Escondido because of the house, food and obviously the people. But the first one in La Paz was super special too. And the second, even if we were fewer people, was also special because my mom was there.",
          name: "Arantza Estrada",
          rating: 5,
        },
        {
          quote:
            "Zentir is a trip that deeply marked me. A before and after in my life. An unforgettable experience, filled with good energy, meaningful friendships, and very special tools.",
          name: "Eloisa Martin",
          rating: 5,
        },
        {
          quote:
            "The activity of the inner child was very special. Last dinner in Lanzarote, the company and food choices were the best.",
          name: "Aleida",
          rating: 5,
        },
        {
          quote:
            "I'm going back home with a full and happy heart. Every minute shared, every laugh, every tear, every story — I will treasure it forever. Thank you! I hope we stay in touch and cross paths many more times.",
          name: "Lucia Denevi",
          role: "Founder, House of Mats",
          rating: 5,
        },
        {
          quote:
            "Thank you María and Lore. Please don't stop hosting retreats — you're truly making a difference in the lives of so many people.",
          name: "María Prieto",
          role: "Founder, Puerto by María",
          rating: 5,
        },
        {
          quote:
            "Unforgettable and incredible experience. Thanks for the effort and the beautiful details that made the difference.",
          name: "Laura Acevedo",
          rating: 5,
        },
        {
          quote:
            "The most revealing workshop is the one about our wounds and masks. It's always relevant and never gets old. Zentir's signature.",
          name: "Sandra Granero",
          role: "Global Director, IQOS",
        },
      ],
    },
    gallery: {
      title: "Moments that stayed with us",
      subtitle: "Gallery of Zentir experiences",
    },
    memberTeaser: {
      eyebrow: "Zentir Studio",
      title: "Zentir, your way",
      paragraph: "Practices, meditations and tools to come back to yourself, wherever you are.",
      ctaPrimary: "I want in",
      ctaSecondary: "I'm already part of it",
    },
    proximosRetiros: {
      eyebrow: "Schedule",
      title: "Upcoming retreats",
      cta: "I want to sign up",
      verMas: "See more",
      dateLocale: "en-US",
    },
    ctaFinal: {
      eyebrow: "Come to Zentir",
      title: "Join our community",
      paragraph:
        "Zentir is built by all of us. Get inspired, discover our upcoming experiences, and let's build what's next together.",
      ctaJoin: "I want to be part of it",
      ctaLogin: "I already have an account",
      ctaLibrary: "Go to my library",
    },
    footer: {
      rights: "All rights reserved.",
    },
    languageSwitcher: {
      label: "Language",
    },
  },
};
