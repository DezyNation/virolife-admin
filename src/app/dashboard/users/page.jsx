'use client'
import React from 'react'
import {
    Button,
    HStack,
    Stack,
    Input,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Switch,
    Box
} from '@chakra-ui/react'
import Link from 'next/link'
import { BsDownload } from 'react-icons/bs'

const Users = () => {
    const arr = [1, 1, 1, 1, 1, 1, 2, 0]
    return (
        <>
            <HStack justifyContent={['space-between']} py={8}>
                <Text className='serif' fontSize={'2xl'} textTransform={'capitalize'}>Users</Text>
                <HStack alignItems={'flex-end'}>
                    <Input placeholder={'Search Users'} />
                    <Button colorScheme={'yellow'}>Search</Button>
                </HStack>
            </HStack>
            <Stack w={'full'} direction={['column']} justifyContent={'space-between'} gap={8}>
                <TableContainer rounded={'16'} w={'full'}>
                    <Table variant={'striped'} colorScheme='gray'>
                        <TableCaption>
                            Users on Virolife
                        </TableCaption>
                        <Thead bgColor={'yellow.400'}>
                            <Tr>
                                <Th>ID</Th>
                                <Th>User Name</Th>
                                <Th>Contact</Th>
                                <Th>Date of Birth</Th>
                                <Th>Subscription</Th>
                                <Th>Registered On</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                arr.map((item, key) => (
                                    <Tr fontSize={'xs'} key={key}>
                                        <Td>{key + 1}</Td>
                                        <Td>Sangam Kumar (M)</Td>
                                        <Td>
                                            <Box>
                                                <p>sangam4742@gmail.com</p>
                                                <p>+91 7838074742</p>
                                            </Box>
                                        </Td>
                                        <Td>28-05-2002</Td>
                                        <Td>Solo</Td>
                                        <Td>28-05-2023 18:23</Td>
                                        <Td>
                                            <HStack gap={4}>
                                                <Switch defaultChecked={true} colorScheme='yellow' />
                                                <Button size={'xs'} colorScheme={'teal'} leftIcon={<BsDownload />}>Attachments</Button>
                                            </HStack>
                                        </Td>
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

export default Users