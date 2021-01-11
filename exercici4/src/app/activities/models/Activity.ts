export class Activity {
  id: number
  name: string
  category: string
  subcategory: string
  price: number
  language: string
  minimumCapacity: number
  limitCapacity: number
  userId: number
  cancelled?: boolean
  date?: Date
  description?: string
  peopleRegistered?: number

}