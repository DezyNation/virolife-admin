'use client'
import React from 'react'
import { Button, FormControl, FormLabel, HStack, Input, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import Link from 'next/link'

const Transactions = () => {
    const arr = [1, 1, 1, 1, 11, 2]
    return (
        <>
            <Text className='serif' fontSize={'2xl'} py={4} textTransform={'capitalize'}>Transactions</Text>
            <HStack py={4}>
                <Button size={'sm'} colorScheme='red'>Print PDF</Button>
                <Button size={'sm'} colorScheme='whatsapp'>Excel</Button>
            </HStack>
            <Stack py={4} gap={4} direction={['column', 'row']} alignItems={'flex-end'}>
                <FormControl w={['full', 'xs']}>
                    <FormLabel>From</FormLabel>
                    <Input type='date' />
                </FormControl>
                <FormControl w={['full', 'xs']}>
                    <FormLabel>To</FormLabel>
                    <Input type='date' />
                </FormControl>
                <Button colorScheme='twitter'>Search</Button>
            </Stack>
            <Stack w={'full'} direction={['column', 'row']} justifyContent={'space-between'} gap={8}>
                <TableContainer rounded={'16'} w={'full'} my={4}>
                    <Table variant={'striped'} colorScheme='gray'>
                        <TableCaption>
                            Subscription Purchases
                        </TableCaption>
                        <Thead bgColor={'yellow.400'}>
                            <Tr>
                                <Th>#</Th>
                                <Th>Trnxn ID</Th>
                                <Th>Campaign</Th>
                                <Th>Payee Name</Th>
                                <Th>Amount</Th>
                                <Th>Timestamp</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                arr.map((item, key) => (
                                    <Tr fontSize={'xs'} key={key}>
                                        <Td>{key + 1}</Td>
                                        <Td>TAN2341</Td>
                                        <Td>
                                            <Link href={'/campaigns/save-the-cow'} target='_blank'>
                                                Save The Cows
                                            </Link>
                                        </Td>
                                        <Td>Sangam Kumar</Td>
                                        <Td>₹ 4565</Td>
                                        <Td>28-05-2023 18:13</Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Stack>
        </>
    )
}

export default Transactions