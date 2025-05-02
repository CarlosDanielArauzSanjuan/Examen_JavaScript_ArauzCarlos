"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRecipeById, updateRecipe } from "@/lib/actions"

export default function EditRecipe({ params }) {
  const router = useRouter()
  const { id } = params
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    time: "",
    difficulty: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        // En una aplicación real, esto cargaría la receta desde una base de datos
        const recipe = await getRecipeById(id)
        setFormData(recipe)
      } catch (error) {
        console.error("Error loading recipe:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadRecipe()
  }, [id, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // En una aplicación real, esto actualizaría la receta en una base de datos
      await updateRecipe(id, formData)
      router.push(`/recipes/${id}`)
    } catch (error) {
      console.error("Error updating recipe:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Cargando receta...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-orange-800">Editar Receta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Receta</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Tortilla Española"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción Breve</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Breve descripción de la receta"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Tiempo de Preparación (minutos)</Label>
                  <Input
                    id="time"
                    name="time"
                    type="number"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Ej: 30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificultad</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Selecciona la dificultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fácil">Fácil</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Difícil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredientes</Label>
                <Textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  required
                  placeholder="Lista de ingredientes (uno por línea)"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instrucciones</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  required
                  placeholder="Pasos para preparar la receta"
                  rows={8}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
