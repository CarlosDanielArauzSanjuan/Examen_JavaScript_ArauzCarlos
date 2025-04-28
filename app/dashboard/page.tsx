"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getRecipes, deleteRecipe } from "@/lib/actions"

export default function Dashboard() {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        // En una aplicación real, esto cargaría recetas desde una base de datos
        const data = await getRecipes()
        setRecipes(data)
      } catch (error) {
        console.error("Error loading recipes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  const handleDeleteRecipe = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
      try {
        // En una aplicación real, esto eliminaría la receta de la base de datos
        await deleteRecipe(id)
        setRecipes(recipes.filter((recipe) => recipe.id !== id))
      } catch (error) {
        console.error("Error deleting recipe:", error)
      }
    }
  }

  const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-800 mb-4 md:mb-0">Mis Recetas</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Input
              placeholder="Buscar recetas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/recipes/new">Añadir Receta</Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Cargando recetas...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No hay recetas</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "No se encontraron recetas que coincidan con tu búsqueda."
                : "Comienza añadiendo tu primera receta."}
            </p>
            {!searchTerm && (
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/recipes/new">Añadir Primera Receta</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onDelete={() => handleDeleteRecipe(recipe.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeCard({ recipe, onDelete }) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-orange-800">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Tiempo:</span> {recipe.time} minutos
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-medium">Dificultad:</span> {recipe.difficulty}
        </p>
        <p className="text-gray-700 line-clamp-3">{recipe.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button asChild variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
          <Link href={`/recipes/${recipe.id}`}>Ver</Link>
        </Button>
        <div className="flex gap-2">
          <Button asChild variant="ghost" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50">
            <Link href={`/recipes/${recipe.id}/edit`}>Editar</Link>
          </Button>
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={onDelete}>
            Eliminar
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
