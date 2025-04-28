"use server"

// Simulación de una base de datos con un array
const users = []
let recipes = [
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

// Función para registrar un usuario
export async function registerUser(userData) {
  // Simulación de registro
  const newUser = {
    id: Date.now().toString(),
    ...userData,
  }
  users.push(newUser)
  return { success: true }
}

// Función para iniciar sesión
export async function loginUser(credentials) {
  // Simulación de login (en una app real verificaríamos credenciales)
  return { success: true }
}

// Función para obtener todas las recetas
export async function getRecipes() {
  // Simulación de obtención de datos
  return recipes
}

// Función para obtener una receta por ID
export async function getRecipeById(id) {
  // Simulación de obtención de datos
  const recipe = recipes.find((r) => r.id === id)
  if (!recipe) {
    throw new Error("Recipe not found")
  }
  return recipe
}

// Función para añadir una nueva receta
export async function addRecipe(recipeData) {
  // Simulación de añadir datos
  const newRecipe = {
    id: Date.now().toString(),
    ...recipeData,
  }
  recipes.push(newRecipe)
  return newRecipe
}

// Función para actualizar una receta
export async function updateRecipe(id, recipeData) {
  // Simulación de actualización de datos
  const index = recipes.findIndex((r) => r.id === id)
  if (index === -1) {
    throw new Error("Recipe not found")
  }

  recipes[index] = {
    ...recipes[index],
    ...recipeData,
  }

  return recipes[index]
}

// Función para eliminar una receta
export async function deleteRecipe(id) {
  // Simulación de eliminación de datos
  const initialLength = recipes.length
  recipes = recipes.filter((r) => r.id !== id)

  if (recipes.length === initialLength) {
    throw new Error("Recipe not found")
  }

  return { success: true }
}

// Variables de estado
let currentPage = 1
let totalPages = 1
const currentResults = []
let currentFilters = {}

// Elementos DOM
const subFiltersContainer = document.getElementById("sub-filters")
const applyFiltersBtn = document.getElementById("apply-filters")
const resultsGrid = document.getElementById("results-grid")
const resultsCount = document.getElementById("results-count")
const pageInfo = document.getElementById("page-info")
const prevPageBtn = document.getElementById("prev-page")
const nextPageBtn = document.getElementById("next-page")

// Configuración de subfiltros para personajes
const filterConfigs = [
  { id: "name", label: "Nombre", type: "text" },
  { id: "race", label: "Raza", type: "text" },
  { id: "gender", label: "Género", type: "text" },
]

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Función principal de inicialización
function initializeApp() {
  // Configurar event listeners
  applyFiltersBtn.addEventListener("click", handleFilterApply)
  prevPageBtn.addEventListener("click", () => changePage(currentPage - 1))
  nextPageBtn.addEventListener("click", () => changePage(currentPage + 1))

  // Inicializar los subfiltros
  renderSubFilters()

  // Cargar datos iniciales
  fetchData()
}

// Renderizar los subfiltros para personajes
function renderSubFilters() {
  subFiltersContainer.innerHTML = ""

  filterConfigs.forEach((filter) => {
    const filterGroup = document.createElement("div")
    filterGroup.className = "filter-group"

    const label = document.createElement("label")
    label.setAttribute("for", `filter-${filter.id}`)
    label.textContent = filter.label + ":"

    const input = document.createElement("input")
    input.setAttribute("type", filter.type)
    input.setAttribute("id", `filter-${filter.id}`)
    input.setAttribute("name", filter.id)
    input.setAttribute("placeholder", `Buscar por ${filter.label.toLowerCase()}`)

    filterGroup.appendChild(label)
    filterGroup.appendChild(input)
    subFiltersContainer.appendChild(filterGroup)
  })
}

// Recopilar los valores de los filtros actuales
function collectFilters() {
  const filters = {}

  filterConfigs.forEach((filter) => {
    const element = document.getElementById(`filter-${filter.id}`)
    if (element && element.value.trim() !== "") {
      filters[filter.id] = element.value.trim()
    }
  })

  return filters
}

// Manejar la aplicación de filtros
function handleFilterApply() {
  currentFilters = collectFilters()
  currentPage = 1
  fetchData()
}

// Función para cambiar de página
function changePage(newPage) {
  currentPage = newPage
  fetchData()
}

// Actualizar la información de paginación
function updatePagination(total) {
  const resultsPerPage = 12
  totalPages = Math.ceil(total / resultsPerPage)

  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`
  prevPageBtn.disabled = currentPage <= 1
  nextPageBtn.disabled = currentPage >= totalPages
}

// Renderizar mensaje de estado (carga, error o sin resultados)
function renderStatusMessage(message, type = "loading") {
  resultsGrid.innerHTML = `<div class="${type}">${message}</div>`
}

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

      // Permitir coincidencias parciales
      return itemValue.includes(filterValue)
    })
  })
}
