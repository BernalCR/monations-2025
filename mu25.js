
document.documentElement.style.setProperty('margin-top', '0', 'important');


// INICIALIZACION DEL SCROLLSMOOTHER Y FUNCION PARA EL RELOAD
const smoother = ScrollSmoother.create({
    smooth: 1.5,
    effects: true,
    //   smoothTouch: 0.2,  
});

// Seleccionar el elemento que contiene el contenido a refrescar
let reloadContent = document.getElementById("smooth-wrapper");

// Variables para guardar el estado del gesto de scroll
let startY = 0; // La posición inicial del dedo al tocar la pantalla
let deltaY = 0; // La distancia recorrida por el dedo al moverse
let threshold = 40; // El umbral de distancia para activar el refrescar

// Función para manejar el evento touchstart
function handleTouchStart(e) {
    // Solo se considera el primer dedo que toca la pantalla
    if (e.touches.length === 1) startY = e.touches[0].clientY;
}

// Función para manejar el evento touchmove
function handleTouchMove(e) {
    // Solo se considera el primer dedo que se mueve en la pantalla
    if (e.touches.length === 1) {
        // Calcular la distancia recorrida por el dedo
        deltaY = e.touches[0].clientY - startY;

        // Si la distancia es positiva y el contenido está en el límite superior del scroll
        if (deltaY > 0 && window.pageYOffset === 0) {
            // Prevenir el comportamiento por defecto del navegador (refrescar)
            e.preventDefault();
            reloadContent.style.transform = "translateY(" + deltaY + "px)";
        }
    }
}

// Función para manejar el evento touchend
function handleTouchEnd(e) {
    // Si se estaba tocando la pantalla y se suelta el dedo
    if (window.pageYOffset <= 0) {
        // Restablecer la posición del contenido y el indicador con una transición suave
        reloadContent.style.transition = "transform 0.3s ease-out";
        reloadContent.style.transform = "translateY(0)";

        setTimeout(() => {
            reloadContent.style.transition = "none"
        }, 300);

        // Si la distancia superaba el umbral, indicar que se está refrescando y cambiar el texto del indicador
        if (deltaY >= threshold) location.reload();
    }
}

// Añadir los listeners para los eventos touchstart, touchmove y touchend
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("touchend", handleTouchEnd);
// INICIALIZACION DEL SCROLLSMOOTHER Y FUNCION PARA EL RELOAD (FIN)


// FUNCION QUE INICIALIZA EL SLIDER DE VENUE
const swiper = new Swiper(".mySwiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 30,
    grabCursor: true,
    navigation: {
        nextEl: `.swiper-button-next`,
        prevEl: `.swiper-button-prev`
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
});


// ANIMACIONES DE GSAP
document.addEventListener("DOMContentLoaded", () => {
    gsap.to("#back_ticket", {
        duration: .6,
        rotation: 8,
        scale: 1.01,
        y: "-1.5rem",
        scrollTrigger: {
            trigger: "#back_ticket",
            start: "top 65%",
            toggleActions: "restart none none reverse",
            // markers: { startColor: "orange", endColor: "purple", fontSize: "12px" },
        }
    });

    gsap.from("#experience .img_animation", {
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        scrollTrigger: {
            trigger: "#experience",
            start: "center 85%",
            // toggleActions: "play none none none",
            // markers: { startColor: "orange", endColor: "purple", fontSize: "12px" },
        }
    });

    gsap.fromTo(".mySwiper", {
        x: "20vw",
        opacity: 0.1
    }, {
        x: 0,
        opacity: 1,
        ease: "power1.out",
        duration: 0.7,
        scrollTrigger: {
            trigger: ".mySwiper",
            start: "top 75%",
            toggleActions: "restart none none reverse"
            // markers: {startColor: "blue", endColor: "yellow", fontSize: "12px"}
        }
    });
});


let overlayH = document.getElementById("overlayH");
let currentLocation = document.querySelectorAll(".currentLocation");
let closeBtns = document.querySelectorAll(".closeHam");
let locationContainer = document.getElementById("location_container");
let hamIcon = document.getElementById("monations-header__ham-icon");

// TRIGGER HAM CANVAS
const tlHam = gsap.timeline();
tlHam.to("#ham_canvas", {
        x: "0%",
        duration: 0.3
    })
    .from("#ham_canvas > div", {
        opacity: 0,
        duration: 0.3
    })
    .to("body", {
        overflow: "hidden"
    }, 0)
    .reversed(true);
    
const playHam = () => {
    if (hamIcon.classList.contains("active")) {
        closeHam();
        return;
    }

    overlayH.classList.add("active");
    hamIcon.classList.add("active");
    tlHam.play();
    document.documentElement.style.overflow = "hidden";
};

const closeHam = () => {
    hamIcon.classList.remove('active');
    overlayH.classList.remove("active")
    tlHam.reverse()
    document.documentElement.style.overflow = "visible";
}

hamIcon.onclick = playHam;
closeBtns.forEach(btn => {
    btn.onclick = closeHam;
})


// SCROLL TO LINKS
const scrollLinks = document.querySelectorAll('.scrollLinks li, #monations-header__logo-box a, .travel_link');
scrollLinks.forEach(a => {
    a.addEventListener("click", () => {
        closeHam();
        smoother.scrollTo(`#${a.dataset.link}`, false, "top 18%")
    })
});


// MODAL COUNTRIES
currentLocation.forEach(flag => {
    flag.addEventListener("click", () => {
        locationContainer.classList.add("active");
        overlayH.style.zIndex = 101
        overlayH.classList.add("active");
        // locationContainer.style.display = "none"
        //   document.documentElement.style.overflow = "hidden";
    });
});

// Remove modal
locationContainer.addEventListener("click", (e) => {
    if (e.target == locationContainer) {
        locationContainer.classList.remove("active");
        overlayH.classList.remove("active");
        overlayH.style.zIndex = 99
        //   locationContainer.style.display = "flex"
        //   document.documentElement.style.overflow = "visible";
    }
});


// AGENDA
const accordionItems = document.querySelectorAll(".accordionItem");

accordionItems.forEach(item => {
  item.addEventListener("click", function () {
    const isActive = item.classList.contains("active");

    // Quitar la clase 'active' de todos
    accordionItems.forEach(i => i.classList.remove("active"));

    // Si no estaba activo, lo activamos (sólo si no era el que ya estaba abierto)
    if (!isActive) {
      item.classList.add("active");
    }
    
    setTimeout(() => {
        smoother.scrollTo(item, false, "top 18%")
    }, 400);
  });
});
    
    
// const agendaBox = document.getElementById("agendaBox");
// const agendaItems = Array.from(agendaBox.children);
// agendaBox.addEventListener("click", e => {
//     agendaItems.forEach(item => {
//         if (item.id === e.target.id) {
//             (item.classList.contains("active")) ? item.classList.remove("active"): item.classList.add("active");
//             setTimeout(() => {
//                 smoother.scrollTo(item, false, "top 18%")
//             }, 400);

//         } else {
//             item.classList.remove("active");
//         }
//     });
// });


// LITEBOX
new LiteBoxPro({
    arrows: {
        default: {
            hide: true
        }
    }
});

let litebox_container = document.querySelector(".lbxp > div:nth-child(2)");
litebox_container.addEventListener("click", (e) => {
    if (e.target != litebox_container.childNodes[0]) document.querySelector(".lbxp > div").click()
});


// ---------------------- COUNTDOWN ---------------------- /
// const countdown = new Date(Date.parse(new Date()) + 1 * 1 * 1 * 10 * 1000); Esto no!!
let monations = "Aug 21, 2025 00:00:00";
let countdown = new Date(monations).getTime();


const days = document.querySelector(".days .countdown__flip-card");
const hours = document.querySelector(".hours .countdown__flip-card");
const minutes = document.querySelector(".minutes .countdown__flip-card");
const seconds = document.querySelector(".seconds .countdown__flip-card");

// ** get the time totals, return them 
function getTimeRemaining(countdown) {
    const now = new Date();
    const diff = countdown - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
        diff,
        days,
        hours,
        minutes,
        seconds
    };
}

function initializeClock(countdown) {
    let timeinterval;

    function updateClock() {
        if (Date.now() > countdown) {
            console.log("La fecha ya pasó.");
            clearInterval(timeinterval);
            return;
        }
        const t = getTimeRemaining(countdown);
        addFlip(days, t.days);
        addFlip(hours, t.hours);
        addFlip(minutes, t.minutes);
        addFlip(seconds, t.seconds);

    }

    updateClock();
    timeinterval = setInterval(updateClock, 1000);
}

const addFlip = (card, time) => {
    // ** confirm time has changed
    const currTime = card.querySelector(".top-half span").innerText;
    if (time == currTime) return;

    let t = time <= 9 ? `0${time}` : time;
    const topHalf = card.querySelector(".top-half span");
    const bottomHalf = card.querySelector(".bottom-half span");
    const topFlip = document.createElement("div");
    const bottomFlip = document.createElement("div");
    // ** add animation, populate with current time
    topFlip.classList.add("top-flip");
    topFlip.innerHTML = `<span>${currTime}</span>`;

    bottomFlip.classList.add("bottom-flip");

    // ** animation begins, update top-half to new time
    topFlip.addEventListener("animationstart", () => {
        topHalf.innerText = t;
    });

    // ** animation ends, remove animated div, update bottom animation to new time
    topFlip.addEventListener("animationend", () => {
        topFlip.remove();
        bottomFlip.innerHTML = `<span>${t}</span>`;
    });

    // ** animation ends, update bottom-half to new time, remove animated div
    bottomFlip.addEventListener("animationend", () => {
        bottomHalf.innerText = t;
        bottomFlip.remove();
    });

    card.appendChild(topFlip);
    card.appendChild(bottomFlip);
};

initializeClock(countdown);
// ---------------------- COUNTDOWN ---------------------- \