"use client"

import React from 'react'
import {
  Card,
  CardContent,
} from "@/components/ui/card"

const CustomerCards = () => {
  return (
    <div className="w-175">
      <Card>
        <CardContent>
          <p className="text-xl">1</p>
          <p className="text-s text-[#7A6150] pt-2">Application</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerCards