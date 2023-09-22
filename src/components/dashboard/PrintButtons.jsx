'use client'
import { Button, HStack, useToast } from '@chakra-ui/react'
import React from 'react'

const PrintButtons = () => {
    const Toast =useToast({position: 'top-right'})

    function handleExport(){
        Toast({
            description: "Work in Progress"
        })
    }

  return (
    <>
    <HStack py={4}>
        <Button colorScheme='red' onClick={handleExport}>
            PDF
        </Button>
        <Button colorScheme='whatsapp' onClick={handleExport}>
            Excel
        </Button>
    </HStack>
    </>
  )
}

export default PrintButtons