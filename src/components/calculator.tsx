"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { HelpCircle } from "lucide-react"

interface CalculatorForm {
  productName: string
  productPrice: string
  adCost: string
  reach: string
  clickConversion: string
  cartConversion: string
  orderConversion: string
}

interface CalculatorResults {
  clicks: number
  carts: number
  orders: number
  revenue: number
  romi: number
  drr: number
  cpr: number
}

const formatNumber = (value: number, digits = 0) => {
  if (isNaN(value) || !isFinite(value)) return '—'
  return value.toLocaleString('ru-RU', { maximumFractionDigits: digits })
}

const MetricTooltip = ({ title, description }: { title: string; description: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="align-middle inline-flex items-center ml-1"><HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-200 cursor-help" /></span>
      </TooltipTrigger>
      <TooltipContent>
        <h4 className="font-semibold mb-2">{title}</h4>
        <p className="text-sm leading-snug whitespace-pre-line">{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export function Calculator() {
  const [form, setForm] = useState<CalculatorForm>({
    productName: "",
    productPrice: "",
    adCost: "",
    reach: "",
    clickConversion: "",
    cartConversion: "",
    orderConversion: "",
  })

  const calculateResults = (): CalculatorResults => {
    const productPrice = parseFloat(form.productPrice) || 0
    const adCost = parseFloat(form.adCost) || 0
    const reach = parseFloat(form.reach) || 0
    const clickConversion = parseFloat(form.clickConversion) || 0
    const cartConversion = parseFloat(form.cartConversion) || 0
    const orderConversion = parseFloat(form.orderConversion) || 0

    const clicks = (reach * clickConversion) / 100
    const carts = (clicks * cartConversion) / 100
    const orders = (carts * orderConversion) / 100
    const revenue = orders * productPrice
    const romi = adCost === 0 ? 0 : ((revenue - adCost) / adCost) * 100
    const drr = revenue === 0 ? 0 : (adCost / revenue) * 100
    const cpr = orders === 0 ? 0 : adCost / orders

    return {
      clicks,
      carts,
      orders,
      revenue,
      romi,
      drr,
      cpr,
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const results = calculateResults()

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Калькулятор эффективности рекламы</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Входные данные</h2>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Название продукта</label>
            <Input
              name="productName"
              value={form.productName}
              onChange={handleInputChange}
              placeholder="Введите название продукта"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Стоимость товара (₽)</label>
            <Input
              type="number"
              name="productPrice"
              value={form.productPrice}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Стоимость рекламы (₽)</label>
            <Input
              type="number"
              name="adCost"
              value={form.adCost}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Охват</label>
            <Input
              type="number"
              name="reach"
              value={form.reach}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Конверсия в клик (%)</label>
            <Input
              type="number"
              name="clickConversion"
              value={form.clickConversion}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Конверсия в корзину (%)</label>
            <Input
              type="number"
              name="cartConversion"
              value={form.cartConversion}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Конверсия в заказ (%)</label>
            <Input
              type="number"
              name="orderConversion"
              value={form.orderConversion}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Результаты</h2>
          
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Количество кликов</p>
                <p className="text-lg font-semibold">{Math.round(results.clicks)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Количество корзин</p>
                <p className="text-lg font-semibold">{Math.round(results.carts)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Количество заказов</p>
                <p className="text-lg font-semibold">{Math.round(results.orders)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Выручка</p>
                <p className="text-lg font-semibold">{Math.round(results.revenue)} ₽</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  ROMI
                  <MetricTooltip
                    title="ROMI (Return on Marketing Investment)"
                    description="Показывает, сколько рублей прибыли мы получили с каждого рубля, вложенного в рекламу. Например, ROMI 200% означает, что на каждый вложенный рубль мы получили 2 рубля прибыли. Формула: ((Выручка - Стоимость рекламы) / Стоимость рекламы) × 100%"
                  />
                </p>
                <p className="text-lg font-semibold">{formatNumber(results.romi)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  ДРР
                  <MetricTooltip
                    title="ДРР (Доля Расходов на Рекламу)"
                    description="Показывает, какая часть выручки ушла на рекламу. Например, ДРР 20% означает, что 20% от всей выручки мы потратили на рекламу. Чем меньше этот показатель, тем лучше. Формула: (Стоимость рекламы / Выручка) × 100%"
                  />
                </p>
                <p className="text-lg font-semibold">{formatNumber(results.drr)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  CPR
                  <MetricTooltip
                    title="CPR (Cost Per Revenue)"
                    description="Показывает, сколько рублей рекламы мы потратили на один заказ. Например, CPR 1000₽ означает, что каждый заказ нам обошелся в 1000 рублей рекламы. Чем меньше этот показатель, тем эффективнее реклама. Формула: Стоимость рекламы / Количество заказов"
                  />
                </p>
                <p className="text-lg font-semibold">{formatNumber(results.cpr)} ₽</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 