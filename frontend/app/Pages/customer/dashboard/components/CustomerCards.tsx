"use client"

import React from 'react'
import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface CustomerCardsProps {
  num: number;
  title: string;

}

const CustomerCards = ({ num, title }: CustomerCardsProps) => {
  return (
    <div className="w-175">
      <Card>
        <CardContent>
          <p className="text-xl">{num}</p>
          <p className="text-s text-[#7A6150] pt-2">{title}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerCards