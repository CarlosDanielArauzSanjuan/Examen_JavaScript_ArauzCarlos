// Añadir este script al final de cada página HTML, justo antes del cierre del body
document.addEventListener("DOMContentLoaded", () => {
    // Función para optimizar el scroll del menú de navegación
    function optimizeNavScroll() {
      const nav = document.querySelector("nav")
      if (!nav) return
  
      const navUl = nav.querySelector("ul")
      if (!navUl) return
  
      // Verificar si hay scroll horizontal
      const hasHorizontalScroll = navUl.scrollWidth > nav.clientWidth
  
      // Mostrar indicador de scroll si es necesario
      const container = document.querySelector("header .container")
      if (container && hasHorizontalScroll) {
        container.classList.add("has-scroll")
      }
  
      // Centrar elemento activo si existe
      const activeItem = navUl.querySelector("a.active")
      if (activeItem && hasHorizontalScroll) {
        // Calcular posición para centrar el elemento activo
        const activeItemRect = activeItem.getBoundingClientRect()
        const navRect = nav.getBoundingClientRect()
        const scrollLeft = activeItemRect.left + activeItemRect.width / 2 - (navRect.left + nav.clientWidth / 2)
  
        // Aplicar scroll suave
        nav.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        })
      }
    }
  
    // Ejecutar al cargar la página
    optimizeNavScroll()
  
    // Ejecutar al cambiar el tamaño de la ventana
    window.addEventListener("resize", optimizeNavScroll)
  })
  