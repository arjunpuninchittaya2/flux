export type Block = {
  id: string
  colId: string
  title: string
  description?: string
  deadline?: string
  link?: string
  done?: boolean
}

export type Column = {
  id: string
  title: string
  count: string | number
  color: string
  textColor: string
}

export type MenuState = {
  type: 'card' | 'column'
  id: string
  x: number
  y: number
  hoveredSubmenu?: 'openIn' | null
}

export const COLORS = [
  { name: 'Default', hex: '#2b2b2b', text: '#d4d4d4' },
  { name: 'Gray', hex: '#3f3f3f', text: '#efefef' },
  { name: 'Brown', hex: '#4a3f35', text: '#e6d3c3' },
  { name: 'Orange', hex: '#523a23', text: '#ffc18f' },
  { name: 'Yellow', hex: '#4a4220', text: '#ffe599' },
  { name: 'Green', hex: '#2c4234', text: '#b1e5c4' },
  { name: 'Blue', hex: '#2b3f4f', text: '#b3d9ff' },
  { name: 'Purple', hex: '#3f314a', text: '#e0c2ff' },
  { name: 'Pink', hex: '#4a2f42', text: '#ffbdf0' },
  { name: 'Red', hex: '#4a2c2a', text: '#ffb3b3' },
]
