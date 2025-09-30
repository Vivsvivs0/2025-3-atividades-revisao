'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
}

interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://dummyjson.com/products')
      const data: ProductsResponse = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      fetchProducts()
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`https://dummyjson.com/products/search?q=${searchTerm}`)
      const data: ProductsResponse = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product])
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCartValue = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">Produtos</h1>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
              />
              <Button onClick={searchProducts}>Buscar</Button>
              <Button variant="outline" onClick={fetchProducts}>Limpar</Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center">Carregando...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <CardDescription>{product.brand}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full"
                      disabled={cart.some(item => item.id === product.id)}
                    >
                      {cart.some(item => item.id === product.id) ? 'No Carrinho' : 'Adicionar ao Carrinho'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Carrinho</CardTitle>
              <CardDescription>{cart.length} itens</CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500">Carrinho vazio</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-green-600 font-bold">${item.price}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span>${totalCartValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}