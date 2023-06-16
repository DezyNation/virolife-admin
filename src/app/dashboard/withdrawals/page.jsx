'use client'
import React from 'react'
import { Button, HStack, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import Link from 'next/link'

const Transactions = () => {
    const arr = [1, 1, 1, 1, 11, 2]
    return (
        <>
            <Text className='serif' fontSize={'2xl'} py={4} textTransform={'capitalize'}>Withdrawals</Text>
            <Stack w={'full'} direction={['column']} justifyContent={'space-between'} gap={8}>
                <TableContainer rounded={'16'} w={'full'}>
                    <Table variant={'striped'} colorScheme='gray'>
                        <TableCaption>
                            New Requests
                        </TableCaption>
                        <Thead bgColor={'yellow.400'}>
                            <Tr>
                                <Th>#</Th>
                                <Th>User Name</Th>
                                <Th>Amount</Th>
                                <Th>Timestamp</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                arr.map((item, key) => (
                                    <Tr fontSize={'xs'} key={key}>
                                        <Td>{key + 1}</Td>
                                        <Td>Sangam Kumar</Td>
                                        <Td>₹ 4565</Td>
                                        <Td>28-05-2023 18:13</Td>
                                        <Td>
                                            <HStack gap={4}>
                                                <Button 
                                                size={'sm'} variant={'outline'}
                                                colorScheme='red' rounded={'full'}>
                                                    Reject
                                                </Button>
                                                <Button size={'sm'} colorScheme='yellow' rounded={'full'}>
                                                    Approve
                                                </Button>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </TableContainer>

                <TableContainer rounded={'16'} w={'full'}>
                    <Table variant={'striped'} colorScheme='gray'>
                        <TableCaption>
                            <Link href={'/dashboard/transactions/report'}>
                                Recent Settlements (View All)
                            </Link>
                        </TableCaption>
                        <Thead bgColor={'yellow.400'}>
                            <Tr>
                                <Th>#</Th>
                                <Th>Trnxn ID</Th>
                                <Th>Plan</Th>
                                <Th>User Name</Th>
                                <Th>Timestamp</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                arr.map((item, key) => (
                                    <Tr fontSize={'xs'} key={key}>
                                        <Td>{key + 1}</Td>
                                        <Td>TAN2341</Td>
                                        <Td>Group Plan</Td>
                                        <Td>Sangam Kumar</Td>
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