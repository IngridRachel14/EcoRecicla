
const categories = [
  {
    key: "cuenta",
    title: "Cuenta y Acceso",
    icon: "👤",
    faqs: [
      {
        question: "¿Cómo me registro o inicio sesión?",
        answer:
          "Puedes registrarte gratuitamente desde la página web o la app móvil usando tu correo electrónico. Una vez registrado, podrás acceder con tu usuario y contraseña para empezar a reciclar y acumular puntos.",
      },
      {
        question: "¿Qué hago si olvidé mi contraseña?",
        answer:
          "Usa la opción 'Olvidé mi contraseña' en la pantalla de inicio de sesión. Recibirás un correo con instrucciones para restablecer tu contraseña y recuperar el acceso a tu cuenta.",
      },
      {
        question: "¿Puedo usar la misma cuenta en varias máquinas?",
        answer:
          "Sí, tu cuenta es única y puedes usarla en cualquiera de las máquinas de reciclaje disponibles en distintas ubicaciones para acumular tus puntos.",
      },
    ],
  },
  {
    key: "escaneo",
    title: "Escaneo de Botellas y Puntos",
    icon: "📷",
    faqs: [
      {
        question: "¿Cómo escanear botellas para obtener puntos?",
        answer:
          "Abre la app y accede a tu cuenta. Al llegar a la máquina de reciclaje, muestra el código QR en la pantalla para iniciar sesión en la máquina. Luego, escanea cada botella plástica usando el escáner de la máquina. Por cada botella válida, recibirás puntos en tu cuenta automáticamente.",
      },
      {
        question: "¿Qué tipo y tamaño de botellas puedo reciclar?",
        answer:
          "Puedes reciclar botellas plásticas PET de 500ml transparentes y de colores, siempre limpias y sin tapa. No se aceptan botellas de otros materiales ni botellas sucias o con residuos.",
      },
      {
        question: "¿Cuántos puntos vale una botella reciclada?",
        answer:
          "Los puntos otorgados dependen del tipo y tamaño de la botella. Usualmente, cada botella vale entre 5 y 10 puntos, según los criterios de la fundación para incentivar el reciclaje responsable.",
      },
      {
        question: "¿Puedo reciclar varias botellas a la vez?",
        answer:
          "Sí, simplemente escanea una por una en la máquina. La aplicación te mostrará el total de puntos acumulados en esa sesión.",
      },
    ],
  },
  {
    key: "recompensas",
    title: "Recompensas y Canje",
    icon: "🎁",
    faqs: [
      {
        question: "¿Cómo canjeo mis puntos acumulados?",
        answer:
          "Ingresa a la sección de recompensas en la app o página web, donde podrás ver los productos y descuentos disponibles para canjear con tus puntos. Selecciona la recompensa que desees y sigue las instrucciones para reclamarla en las tiendas asociadas.",
      },
      {
        question: "¿Cuánto tiempo tengo para canjear mis puntos?",
        answer:
          "Los puntos que acumules son válidos por un año desde la fecha en que se acreditaron en tu cuenta. Te recomendamos canjearlos antes de esa fecha para no perderlos.",
      },
      {
        question: "¿Puedo transferir mis puntos a otra persona?",
        answer:
          "Actualmente no está disponible la opción de transferir puntos entre usuarios. Cada cuenta es personal y los puntos solo pueden ser usados por el titular.",
      },
      {
        question: "¿Qué tipo de productos puedo obtener con mis puntos?",
        answer:
          "Puedes canjear tus puntos por productos ecológicos como bolsas reutilizables, botellas reciclables, plantas y descuentos en tiendas que apoyan la iniciativa ambiental.",
      },
    ],
  },
  {
    key: "general",
    title: "Preguntas Generales",
    icon: "♻️",
    faqs: [
      {
        question: "¿Qué es este proyecto de reciclaje con máquinas y puntos?",
        answer:
          "Este proyecto busca fomentar el reciclaje responsable de botellas plásticas mediante la instalación de máquinas especiales que reconocen las botellas y otorgan puntos a los usuarios, los cuales pueden canjearse por productos o descuentos en tiendas asociadas, promoviendo así la economía circular y la conciencia ambiental.",
      },
      {
        question: "¿Dónde puedo encontrar las máquinas de reciclaje?",
        answer:
          "Las máquinas están ubicadas estratégicamente en centros comerciales, parques, universidades y plazas principales para facilitar el acceso y fomentar la participación de la comunidad.",
      },
      {
        question: "¿Cómo puedo crear una cuenta para empezar a reciclar?",
        answer:
          "Puedes crear tu cuenta fácilmente desde la página web o descargar nuestra app móvil, registrándote con tu correo electrónico para empezar a acumular puntos desde la primera botella reciclada.",
      },
      {
        question: "¿Quiénes pueden participar en este programa de reciclaje?",
        answer:
          "Cualquier persona interesada en ayudar al medio ambiente y fomentar el reciclaje puede participar. Solo necesitas una cuenta registrada para empezar a usar las máquinas y acumular puntos.",
      },
      {
        question: "¿Qué hago si la máquina no reconoce mi botella?",
        answer:
          "Si tienes problemas con alguna máquina, puedes reportarlo desde la app o página web en la sección de soporte, para que nuestro equipo técnico lo revise y solucione lo antes posible.",
      },
    ],
  },
];

export default categories;
