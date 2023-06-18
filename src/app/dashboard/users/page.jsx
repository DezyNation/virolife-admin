'use client'
import React, { useEffect, useState } from 'react'
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
    Box,
    useToast
} from '@chakra-ui/react'
import Link from 'next/link'
import { BsDownload } from 'react-icons/bs'
import BackendAxios from '@/utils/axios'

const Users = () => {
    const arr = [1, 1, 1, 1, 1, 1, 2, 0]
    const Toast = useToast({position: 'top-right'})
    const [users, setUsers] = useState([])

    function fetchUsers(){
        BackendAxios.get("/api/users").then(res=> {
            setUsers(res.data)
        }).catch(err =>{
            Toast({
                status: 'error',
                description: err?.response?.data?.message || err?.response?.data || err?.message
            })
        })
    }
    useEffect(()=>{
        fetchUsers()
    },[])

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
                                users.map((user, key) => (
                                    <Tr fontSize={'xs'} key={key}>
                                        <Td>{user.id}</Td>
                                        <Td>{user.name} ({user.gender})</Td>
                                        <Td>
                                            <Box>
                                                <p>{user.email}</p>
                                                <p>+91 {user.phone}</p>
                                            </Box>
                                        </Td>
                                        <Td>{new Date(user.dob).toDateString()}</Td>
                                        <Td>Solo</Td>
                                        <Td>{new Date(user.created_at).toLocaleString()}</Td>
                                        <Td>
                                            <HStack gap={4}>
                                                <Switch defaultChecked={true} colorScheme='yellow' onChange={e => Toast({status: 'success', description: 'Updated successfully!'})} />
                                                <Button 
                                                size={'xs'} colorScheme={'teal'} leftIcon={<BsDownload />}>Attachments</Button>
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