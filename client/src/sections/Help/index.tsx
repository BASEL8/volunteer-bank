import React from 'react'
import {useParams } from 'react-router-dom'
export const Help: React.FC<{}> = () => {
  const { id } = useParams()
  return (
    <div>
      `help ${id}`
    </div>
  )
}