'use client'
import React from 'react'
import { Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import Link from 'next/link'

const Transactions = () => {
    const arr = [1, 1, 1, 1, 11, 2]
    return (
        <>
            <Text className='serif' fontSize={'2xl'} py={4} textTransform={'capitalize'}>Transactions</Text>
            <Stack w={'full'} direction={['column', 'row']} justifyContent={'space-between'} gap={8}>
                <TableContainer rounded={'16'} flex={['unset', 3]}>
                    <Table variant={'striped'} colorScheme='gray'>
                        <TableCaption>
                            <Link href={'/dashboard/transactions/report'}>
                                Subscription Purchases (View All)
                            </Link>
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
                                        <Td> </Td>
                                        <Td>
                                             
                                        </Td>
                                        <Td> </Td>
                                        <Td> </Td>
                                        <Td> </Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Stack>
                            <br /><br />
            <TableContainer rounded={'16'} py={6}>
            <Table variant={'striped'} colorScheme='gray'>
                        <TableCaption>
                            Wallet Topup
                        </TableCaption>
                        <Thead bgColor={'yellow.400'}>
                            <Tr>
                                <Th>#</Th>
                                <Th>Trnxn ID</Th>
                                <Th>User</Th>
                                <Th>Amount</Th>
                                <Th>Remarks</Th>
                                <Th>Timestamp</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                arr.map((item, key) => (
                                    <Tr fontSize={'xs'} key={key}>
                                        <Td>{key + 1}</Td>
                                        <Td> </Td>
                                        <Td> </Td>
                                        <Td> </Td>
                                        <Td></Td>
                                        <Td> </Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
        </>
    )
}

export default Transactions