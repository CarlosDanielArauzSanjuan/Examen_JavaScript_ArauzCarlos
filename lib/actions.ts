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
