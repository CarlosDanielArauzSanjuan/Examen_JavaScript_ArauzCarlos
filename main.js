// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado completamente")

  // Inicializar localStorage con datos predeterminados si no existen
  initializeLocalStorage()

  // Configurar event listeners basados en la página actual
  setupPageSpecificListeners()
})

// Inicializar localStorage con datos predeterminados
function initializeLocalStorage() {
  console.log("Inicializando localStorage")

  // Verificar si ya existen recetas en localStorage
  if (!localStorage.getItem("recipes")) {
    console.log("Creando recetas predeterminadas en localStorage")
    // Datos predeterminados
    const defaultRecipes = [
      {
        id: "1",
        title: "Arepa de queso",
        description: "Deliciosa Arepa de queso tradicional colombiana",
        ingredients: "1 lt agua\n4 tasas harina\n1 queso\nAceite de oliva\nSal",
        instructions:
          "calentar el agua hasta hervir\nPicar el queso en cuadritos\nAgregar la Harina al agua\nBati y/o mezclar a velocidad media \nmoldear al tamaño deseado y asar en un sarten a fuego alto",
        time: "45",
        difficulty: "Media",
      },
      {
        id: "2",
        title: "Sancocho",
        description: "Sopa caliente perfecta para paseos",
        ingredients:
          "1 kg costilla de res\n1 cebollin verde\n1 cilantro\n1 diente de ajo\n papa al gusto\nlimon\nSal\nplatano maduro (opcional)",
        instructions:
          "Lavar y trocear todas las verduras\nagregar la papa troceada\nAñadir el Res, limon y sal al gusto\ndejar cocinar hasta que la carne este a punto de desmeche",
        time: "60",
        difficulty: "Fácil",
      },
      {
        id: "3",
        title: "Arroz con pollo",
        description: "El plato más internacional de la cocina Colombiana",
        ingredients:
          "400g de arroz \n1 pollo troceado\n100g de arvejas\n10g de maggi\nAzafrán\nPimentón\nAceite de oliva\nSal\nAgua",
        instructions:
          "Sofreír el pollo troceado\nAñadir las verduras y sofreír\nAñadir el arroz y sofreír brevemente\nAñadir el pimentón y el azafrán\nAñadir el agua con el maggi disuelto (doble que de arroz) y la sal\nCocer a fuego medio-alto durante 10 minutos\nBajar el fuego y cocer 8 minutos más\nDejar reposar 5 minutos antes de servir",
        time: "60",
        difficulty: "Difícil",
      },
    ]

    // Guardar en localStorage
    localStorage.setItem("recipes", JSON.stringify(defaultRecipes))
  } else {
    console.log("Recetas ya existen en localStorage")
  }

  // Inicializar usuarios si no existen
  if (!localStorage.getItem("users")) {
    console.log("Creando array de usuarios vacío en localStorage")
    localStorage.setItem("users", JSON.stringify([]))
  }
}

// Configurar event listeners específicos para cada página
function setupPageSpecificListeners() {
  const currentPage = window.location.pathname.split("/").pop()
  console.log("Página actual:", currentPage)

  // Página de inicio (index.html)
  if (currentPage === "" || currentPage === "index.html") {
    console.log("Configurando página de inicio")
    // Verificar si el usuario está logueado
    if (!isUserLoggedIn()) {
      // Redirigir a registro si no hay sesión
      window.location.href = "register.html"
    }
  }

  // Página de registro
  else if (currentPage === "register.html") {
    console.log("Configurando página de registro")
    const registerForm = document.getElementById("register-form")
    if (registerForm) {
      registerForm.addEventListener("submit", handleRegister)
    }
  }

  // Página de login
  else if (currentPage === "login.html") {
    console.log("Configurando página de login")
    const loginForm = document.getElementById("login-form")
    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin)
    }
  }

  // Página de creación de recetas
  else if (currentPage === "create-recipe.html") {
    console.log("Configurando página de creación de recetas")
    const recipeForm = document.getElementById("recipe-form")
    if (recipeForm) {
      // Verificar si es edición o creación
      const urlParams = new URLSearchParams(window.location.search)
      const recipeId = urlParams.get("id")

      if (recipeId) {
        // Cargar datos de la receta para edición
        loadRecipeForEdit(recipeId)
      }

      recipeForm.addEventListener("submit", handleRecipeSubmit)
    }

    // Configurar botón de cancelar
    const cancelButton = document.getElementById("cancel-button")
    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        window.location.href = "recipes.html"
      })
    }
  }

  // Página de lista de recetas
  else if (currentPage === "recipes.html") {
    console.log("Configurando página de lista de recetas")
    loadRecipes()

    // Configurar filtros
    const searchButton = document.getElementById("search-button")
    const applyFiltersButton = document.getElementById("apply-filters")
    const clearFiltersButton = document.getElementById("clear-filters")

    if (searchButton) {
      searchButton.addEventListener("click", handleSearch)
    }

    if (applyFiltersButton) {
      applyFiltersButton.addEventListener("click", applyFilters)
    }

    if (clearFiltersButton) {
      clearFiltersButton.addEventListener("click", clearFilters)
    }
  }

  // Página de detalle de receta
  else if (currentPage === "view-recipe.html") {
    console.log("Configurando página de detalle de receta")
    loadRecipeDetail()

    // Configurar botones de acción
    const editButton = document.getElementById("edit-recipe")
    const deleteButton = document.getElementById("delete-recipe")

    if (editButton) {
      editButton.addEventListener("click", () => {
        const urlParams = new URLSearchParams(window.location.search)
        const recipeId = urlParams.get("id")
        if (recipeId) {
          window.location.href = `create-recipe.html?id=${recipeId}`
        }
      })
    }

    if (deleteButton) {
      deleteButton.addEventListener("click", handleDeleteRecipe)
    }

    // Configurar botones del modal de confirmación
    const cancelDeleteButton = document.getElementById("cancel-delete")
    const confirmDeleteButton = document.getElementById("confirm-delete")

    if (cancelDeleteButton) {
      cancelDeleteButton.addEventListener("click", () => {
        const modal = document.getElementById("delete-modal")
        if (modal) {
          modal.classList.remove("show")
        }
      })
    }

    if (confirmDeleteButton) {
      confirmDeleteButton.addEventListener("click", confirmDeleteRecipe)
    }
  }
}

// Verificar si el usuario está logueado
function isUserLoggedIn() {
  return localStorage.getItem("currentUser") !== null
}

// Manejar el registro de usuario
function handleRegister(e) {
  e.preventDefault()
  console.log("Procesando registro de usuario")

  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  try {
    // Obtener usuarios actuales
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Verificar si el email ya existe
    if (users.some((user) => user.email === email)) {
      alert("Este correo electrónico ya está registrado")
      return
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // En una app real, esto debería estar encriptado
    }

    // Añadir a la lista y guardar
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Establecer sesión
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }),
    )

    // Redirigir a la página principal
    window.location.href = "index.html"
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    alert("Error al registrar usuario: " + error.message)
  }
}

// Manejar el inicio de sesión
function handleLogin(e) {
  e.preventDefault()
  console.log("Procesando inicio de sesión")

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  try {
    // Obtener usuarios
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Buscar usuario por email y password
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      alert("Credenciales incorrectas")
      return
    }

    // Establecer sesión
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    )

    // Redirigir a la página principal
    window.location.href = "index.html"
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    alert("Error al iniciar sesión: " + error.message)
  }
}

// Cerrar sesión
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "login.html"
}

// Función para obtener todas las recetas
function getRecipes() {
  try {
    console.log("Obteniendo recetas de localStorage")
    const recipes = JSON.parse(localStorage.getItem("recipes") || "[]")
    return recipes
  } catch (error) {
    console.error("Error al obtener recetas:", error)
    return []
  }
}

// Función para obtener una receta por ID
function getRecipeById(id) {
  try {
    console.log(`Buscando receta con ID: ${id}`)
    const recipes = JSON.parse(localStorage.getItem("recipes") || "[]")
    const recipe = recipes.find((r) => r.id === id)

    if (!recipe) {
      throw new Error("Receta no encontrada")
    }

    return recipe
  } catch (error) {
    console.error("Error al obtener receta:", error)
    throw error
  }
}

// Función para añadir una nueva receta
function addRecipe(recipeData) {
  try {
    console.log("Añadiendo nueva receta:", recipeData)
    // Obtener recetas actuales
    const recipes = JSON.parse(localStorage.getItem("recipes") || "[]")

    // Crear nueva receta
    const newRecipe = {
      id: Date.now().toString(),
      ...recipeData,
    }

    // Añadir a la lista y guardar
    recipes.push(newRecipe)
    localStorage.setItem("recipes", JSON.stringify(recipes))
    console.log("Receta guardada correctamente")

    return newRecipe
  } catch (error) {
    console.error("Error al añadir receta:", error)
    throw error
  }
}

// Función para actualizar una receta
function updateRecipe(id, recipeData) {
  try {
    console.log(`Actualizando receta con ID: ${id}`, recipeData)
    // Obtener recetas actuales
    const recipes = JSON.parse(localStorage.getItem("recipes") || "[]")

    // Buscar índice de la receta
    const index = recipes.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error("Receta no encontrada")
    }

    // Actualizar receta
    recipes[index] = {
      ...recipes[index],
      ...recipeData,
    }

    // Guardar cambios
    localStorage.setItem("recipes", JSON.stringify(recipes))
    console.log("Receta actualizada correctamente")

    return recipes[index]
  } catch (error) {
    console.error("Error al actualizar receta:", error)
    throw error
  }
}

// Función para eliminar una receta
function deleteRecipe(id) {
  try {
    console.log(`Eliminando receta con ID: ${id}`)
    // Obtener recetas actuales
    const recipes = JSON.parse(localStorage.getItem("recipes") || "[]")

    // Verificar que la receta existe
    const initialLength = recipes.length
    const updatedRecipes = recipes.filter((r) => r.id !== id)

    if (updatedRecipes.length === initialLength) {
      throw new Error("Receta no encontrada")
    }

    // Guardar cambios
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes))
    console.log("Receta eliminada correctamente")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar receta:", error)
    throw error
  }
}

// Asegurarnos de que la función loadRecipes() esté correctamente implementada
// y no redirija incorrectamente al usuario

// Actualizar la función loadRecipes para normalizar los valores mostrados
function loadRecipes() {
  console.log("Cargando lista de recetas")
  const recipesContainer = document.getElementById("recipes-container")
  const noRecipesMessage = document.getElementById("no-recipes-message")

  if (!recipesContainer) {
    console.error("Elemento 'recipes-container' no encontrado")
    return
  }

  try {
    const recipes = getRecipes()
    console.log(`Se encontraron ${recipes.length} recetas`)

    if (recipes.length === 0) {
      if (noRecipesMessage) {
        noRecipesMessage.style.display = "block"
      }
      return
    }

    if (noRecipesMessage) {
      noRecipesMessage.style.display = "none"
    }

    recipesContainer.innerHTML = ""

    recipes.forEach((recipe) => {
      // Normalizar el valor de dificultad para mostrar
      let displayDifficulty = recipe.difficulty || "No especificada"

      // Normalizar para mostrar consistentemente
      if (displayDifficulty.toLowerCase().match(/^f[aá]cil$/i)) {
        displayDifficulty = "Fácil"
      } else if (displayDifficulty.toLowerCase().match(/^medi[ao]$/i)) {
        displayDifficulty = "Media"
      } else if (displayDifficulty.toLowerCase().match(/^dif[ií]cil$/i)) {
        displayDifficulty = "Difícil"
      }

      const recipeCard = document.createElement("div")
      recipeCard.className = "recipe-card"
      recipeCard.innerHTML = `
        <div class="recipe-card-content">
          <h3>${recipe.title}</h3>
          <div class="recipe-meta">
            <span>${displayDifficulty}</span>
            <span>${recipe.time || "0"} minutos</span>
          </div>
          <p class="recipe-description">${recipe.description || "Sin descripción"}</p>
          <div class="recipe-card-actions">
            <a href="view-recipe.html?id=${recipe.id}" class="btn btn-primary">Ver Receta</a>
            <button class="btn btn-danger delete-recipe" data-id="${recipe.id}">Eliminar</button>
          </div>
        </div>
      `

      recipesContainer.appendChild(recipeCard)

      // Añadir event listener para eliminar
      const deleteBtn = recipeCard.querySelector(".delete-recipe")
      if (deleteBtn) {
        deleteBtn.addEventListener("click", function (e) {
          e.preventDefault()
          const recipeId = this.getAttribute("data-id")
          if (confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
            try {
              deleteRecipe(recipeId)
              loadRecipes() // Recargar la lista
            } catch (error) {
              alert("Error al eliminar la receta: " + error.message)
            }
          }
        })
      }
    })
  } catch (error) {
    console.error("Error al cargar recetas:", error)
    recipesContainer.innerHTML = `<div class="error">Error al cargar recetas: ${error.message}</div>`
  }
}

// Actualizar la función handleRecipeSubmit para normalizar los valores antes de guardar
function handleRecipeSubmit(e) {
  e.preventDefault()
  console.log("Procesando envío de formulario de receta")

  const form = e.target
  const recipeId = document.getElementById("recipe-id")?.value

  // Obtener y normalizar el valor de dificultad
  let difficulty = document.getElementById("difficulty")?.value
  if (difficulty) {
    if (difficulty.toLowerCase().match(/^f[aá]cil$/i)) {
      difficulty = "Fácil"
    } else if (difficulty.toLowerCase().match(/^medi[ao]$/i)) {
      difficulty = "Media"
    } else if (difficulty.toLowerCase().match(/^dif[ií]cil$/i)) {
      difficulty = "Difícil"
    }
  }

  const recipeData = {
    title: document.getElementById("recipe-name")?.value,
    time: document.getElementById("prep-time")?.value,
    servings: document.getElementById("servings")?.value,
    category: document.getElementById("category")?.value,
    difficulty: difficulty,
    ingredients: document.getElementById("ingredients")?.value,
    instructions: document.getElementById("instructions")?.value,
    description: document.getElementById("recipe-name")?.value + " - Receta creada por el usuario", // Valor mejorado
  }

  console.log("Datos de la receta:", recipeData)

  try {
    if (recipeId) {
      // Actualizar receta existente
      updateRecipe(recipeId, recipeData)
    } else {
      // Crear nueva receta
      addRecipe(recipeData)
    }

    // Redirigir a la lista de recetas
    window.location.href = "recipes.html"
  } catch (error) {
    console.error("Error al guardar receta:", error)
    alert("Error al guardar la receta: " + error.message)
  }
}

// Cargar receta para edición
function loadRecipeForEdit(recipeId) {
  console.log(`Cargando receta para edición: ${recipeId}`)
  try {
    const recipe = getRecipeById(recipeId)

    // Actualizar título del formulario
    const formTitle = document.getElementById("form-title")
    if (formTitle) {
      formTitle.textContent = "Editar Receta"
    }

    // Rellenar campos del formulario
    document.getElementById("recipe-id").value = recipe.id
    document.getElementById("recipe-name").value = recipe.title
    document.getElementById("prep-time").value = recipe.time
    document.getElementById("servings").value = recipe.servings || ""
    document.getElementById("category").value = recipe.category || ""
    document.getElementById("difficulty").value = recipe.difficulty || ""
    document.getElementById("ingredients").value = recipe.ingredients
    document.getElementById("instructions").value = recipe.instructions
  } catch (error) {
    console.error("Error al cargar receta para edición:", error)
    alert("Error al cargar la receta: " + error.message)
    window.location.href = "recipes.html"
  }
}

// Cargar detalle de receta
function loadRecipeDetail() {
  console.log("Cargando detalle de receta")
  const recipeDetail = document.getElementById("recipe-detail")
  if (!recipeDetail) {
    console.error("Elemento 'recipe-detail' no encontrado")
    return
  }

  // Obtener ID de la URL
  const urlParams = new URLSearchParams(window.location.search)
  const recipeId = urlParams.get("id")

  if (!recipeId) {
    recipeDetail.innerHTML = `<div class="error">ID de receta no especificado</div>`
    return
  }

  try {
    const recipe = getRecipeById(recipeId)
    console.log("Receta encontrada:", recipe)

    recipeDetail.innerHTML = `
      <h2 class="recipe-title">${recipe.title}</h2>
      
      <div class="recipe-info">
        <div class="recipe-info-item">
          <strong>Dificultad:</strong> ${recipe.difficulty || "No especificada"}
        </div>
        <div class="recipe-info-item">
          <strong>Tiempo:</strong> ${recipe.time || "0"} minutos
        </div>
        <div class="recipe-info-item">
          <strong>Porciones:</strong> ${recipe.servings || "No especificado"}
        </div>
        <div class="recipe-info-item">
          <strong>Categoría:</strong> ${recipe.category || "No especificada"}
        </div>
      </div>
      
      <div class="recipe-section">
        <h3>Ingredientes</h3>
        <ul class="ingredients-list">
          ${recipe.ingredients
            .split("\n")
            .map((ingredient) => `<li>${ingredient.trim()}</li>`)
            .join("")}
        </ul>
      </div>
      
      <div class="recipe-section">
        <h3>Instrucciones</h3>
        <ol class="instructions-list">
          ${recipe.instructions
            .split("\n")
            .map((instruction) => `<li>${instruction.trim()}</li>`)
            .join("")}
        </ol>
      </div>
    `
  } catch (error) {
    console.error("Error al cargar detalle de receta:", error)
    recipeDetail.innerHTML = `<div class="error">Error al cargar la receta: ${error.message}</div>`
  }
}

// Manejar eliminación de receta
function handleDeleteRecipe() {
  console.log("Iniciando proceso de eliminación de receta")
  const modal = document.getElementById("delete-modal")
  if (modal) {
    modal.classList.add("show")
  }
}

// Confirmar eliminación de receta
function confirmDeleteRecipe() {
  console.log("Confirmando eliminación de receta")
  const urlParams = new URLSearchParams(window.location.search)
  const recipeId = urlParams.get("id")

  if (!recipeId) {
    alert("ID de receta no especificado")
    return
  }

  try {
    deleteRecipe(recipeId)
    window.location.href = "recipes.html"
  } catch (error) {
    console.error("Error al eliminar receta:", error)
    alert("Error al eliminar la receta: " + error.message)

    const modal = document.getElementById("delete-modal")
    if (modal) {
      modal.classList.remove("show")
    }
  }
}

// Manejar búsqueda
function handleSearch() {
  console.log("Procesando búsqueda")
  const searchInput = document.getElementById("search-input")
  if (!searchInput) return

  const searchTerm = searchInput.value.trim().toLowerCase()

  if (searchTerm === "") {
    loadRecipes()
    return
  }

  try {
    const recipes = getRecipes()
    const filteredRecipes = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm) || recipe.description.toLowerCase().includes(searchTerm),
    )

    displayFilteredRecipes(filteredRecipes)
  } catch (error) {
    console.error("Error al buscar recetas:", error)
    alert("Error al buscar recetas: " + error.message)
  }
}

// Declarar currentFilters
let currentFilters = {}

// Reemplazar la función filterResults con esta versión mejorada:

// Filtrar resultados según los criterios
function filterResults(data) {
  if (Object.keys(currentFilters).length === 0) {
    return data
  }

  return data.filter((item) => {
    return Object.entries(currentFilters).every(([key, value]) => {
      if (!item[key]) return false

      // Convertir ambos a minúsculas para comparación sin distinción de mayúsculas/minúsculas
      const itemValue = String(item[key]).toLowerCase()
      const filterValue = String(value).toLowerCase()

      // Normalizar valores de dificultad
      if (key === "difficulty") {
        // Normalizar "medio" y "media" para que coincidan
        const normalizedItemValue = itemValue.replace(/^medi[ao]$/i, "media")
        const normalizedFilterValue = filterValue.replace(/^medi[ao]$/i, "media")

        // Normalizar "fácil" y "facil" para que coincidan
        const normalizedItemValue2 = normalizedItemValue.replace(/^f[aá]cil$/i, "facil")
        const normalizedFilterValue2 = normalizedFilterValue.replace(/^f[aá]cil$/i, "facil")

        // Normalizar "difícil" y "dificil" para que coincidan
        const finalItemValue = normalizedItemValue2.replace(/^dif[ií]cil$/i, "dificil")
        const finalFilterValue = normalizedFilterValue2.replace(/^dif[ií]cil$/i, "dificil")

        return finalItemValue.includes(finalFilterValue)
      }

      // Para otros campos, permitir coincidencias parciales
      return itemValue.includes(filterValue)
    })
  })
}

// Actualizar la función applyFilters para que sea más robusta
function applyFilters() {
  console.log("Aplicando filtros")
  const categoryFilter = document.getElementById("category-filter")
  const difficultyFilter = document.getElementById("difficulty-filter")

  if (!categoryFilter || !difficultyFilter) return

  const category = categoryFilter.value
  const difficulty = difficultyFilter.value

  currentFilters = {}

  if (category) {
    currentFilters.category = category
  }

  if (difficulty) {
    currentFilters.difficulty = difficulty
  }

  try {
    const recipes = getRecipes()
    const filteredRecipes = filterResults(recipes)
    displayFilteredRecipes(filteredRecipes)
  } catch (error) {
    console.error("Error al filtrar recetas:", error)
    alert("Error al filtrar recetas: " + error.message)
  }
}

// Limpiar filtros
function clearFilters() {
  console.log("Limpiando filtros")
  const searchInput = document.getElementById("search-input")
  const categoryFilter = document.getElementById("category-filter")
  const difficultyFilter = document.getElementById("difficulty-filter")

  if (searchInput) searchInput.value = ""
  if (categoryFilter) categoryFilter.value = ""
  if (difficultyFilter) difficultyFilter.value = ""

  // Limpiar currentFilters
  currentFilters = {}

  loadRecipes()
}

// Actualizar la función displayFilteredRecipes para normalizar los valores mostrados
function displayFilteredRecipes(recipes) {
  console.log(`Mostrando ${recipes.length} recetas filtradas`)
  const recipesContainer = document.getElementById("recipes-container")
  const noRecipesMessage = document.getElementById("no-recipes-message")

  if (!recipesContainer) return

  if (recipes.length === 0) {
    recipesContainer.innerHTML = `
      <div class="no-recipes-message">
        <p>No se encontraron recetas que coincidan con los criterios de búsqueda.</p>
        <button id="clear-search" class="btn btn-secondary">Limpiar búsqueda</button>
      </div>
    `

    const clearSearchButton = document.getElementById("clear-search")
    if (clearSearchButton) {
      clearSearchButton.addEventListener("click", clearFilters)
    }

    if (noRecipesMessage) {
      noRecipesMessage.style.display = "none"
    }

    return
  }

  if (noRecipesMessage) {
    noRecipesMessage.style.display = "none"
  }

  recipesContainer.innerHTML = ""

  recipes.forEach((recipe) => {
    // Normalizar el valor de dificultad para mostrar
    let displayDifficulty = recipe.difficulty || "No especificada"

    // Normalizar para mostrar consistentemente
    if (displayDifficulty.toLowerCase().match(/^f[aá]cil$/i)) {
      displayDifficulty = "Fácil"
    } else if (displayDifficulty.toLowerCase().match(/^medi[ao]$/i)) {
      displayDifficulty = "Media"
    } else if (displayDifficulty.toLowerCase().match(/^dif[ií]cil$/i)) {
      displayDifficulty = "Difícil"
    }

    const recipeCard = document.createElement("div")
    recipeCard.className = "recipe-card"
    recipeCard.innerHTML = `
      <div class="recipe-card-content">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
          <span>${displayDifficulty}</span>
          <span>${recipe.time || "0"} minutos</span>
        </div>
        <p class="recipe-description">${recipe.description || "Sin descripción"}</p>
        <div class="recipe-card-actions">
          <a href="view-recipe.html?id=${recipe.id}" class="btn btn-primary">Ver Receta</a>
          <button class="btn btn-danger delete-recipe" data-id="${recipe.id}">Eliminar</button>
        </div>
      </div>
    `

    recipesContainer.appendChild(recipeCard)

    // Añadir event listener para eliminar
    const deleteBtn = recipeCard.querySelector(".delete-recipe")
    if (deleteBtn) {
      deleteBtn.addEventListener("click", function (e) {
        e.preventDefault()
        const recipeId = this.getAttribute("data-id")
        if (confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
          try {
            deleteRecipe(recipeId)
            displayFilteredRecipes(recipes.filter((r) => r.id !== recipeId))
          } catch (error) {
            alert("Error al eliminar la receta: " + error.message)
          }
        }
      })
    }
  })
}
