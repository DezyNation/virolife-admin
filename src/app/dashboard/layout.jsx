'use client'
import React, { useEffect } from 'react'
import {
    Stack,
    Box,
    Text,
    Show,
    VStack,
    HStack
} from '@chakra-ui/react'
import Link from 'next/link'
import {
    AiFillDashboard,
    AiFillYoutube
} from 'react-icons/ai'
import { BsCashCoin, BsCurrencyRupee, BsFill1CircleFill, BsHeartFill, BsMegaphoneFill, BsPerson, BsPersonFill, BsPower } from 'react-icons/bs';
import { MdGroups } from 'react-icons/md';
import { BiUser } from 'react-icons/bi'


const Layout = ({ children }) => {
    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Show above='md'>
                    <Box p={8} bg={'blanchedalmond'} w={'xs'}>
                        <Text className='serif' fontSize={'xl'} fontWeight={'semibold'}>Virolife</Text>
                        <VStack w={'full'} gap={4} pt={8} alignItems={'flex-start'}>
                            <Link href={'/auth/info'}>
                                <HStack gap={4}>
                                    <BsPersonFill size={20} />
                                    <Text>Profile</Text>
                                </HStack>
                            </Link>
                            <Link href={'/dashboard'}>
                                <HStack gap={4}>
                                    <AiFillDashboard size={20} />
                                    <Text>Dashboard</Text>
                                </HStack>
                            </Link>
                            <br />
                            <Link href={'/dashboard/videos'}>
                                <HStack gap={4}>
                                    <AiFillYoutube size={20} />
                                    <Text>Manage Videos</Text>
                                </HStack>
                            </Link>
                            <Link href={'/dashboard/users'}>
                                <HStack gap={4}>
                                    <BiUser size={20} />
                                    <Text>Manage Users</Text>
                                </HStack>
                            </Link>
                            <Link href={'/dashboard/campaigns'}>
                                <HStack gap={4}>
                                    <BsMegaphoneFill size={20} />
                                    <Text>Manage Campaigns</Text>
                                </HStack>
                            </Link>
                            <br />
                            <Link href={'/dashboard/transactions'}>
                                <HStack gap={4}>
                                    <BsCurrencyRupee size={20} />
                                    <Text>Transactions</Text>
                                </HStack>
                            </Link>
                            <Link href={'/dashboard/withdrawals'}>
                                <HStack gap={4}>
                                    <BsCashCoin size={20} />
                                    <Text>Withdrawals</Text>
                                </HStack>
                            </Link>
                            <Link href={'/dashboard'}>
                                <HStack gap={4}>
                                    <MdGroups size={20} />
                                    <Text>Groups</Text>
                                </HStack>
                            </Link>
                            <br />
                            <Link href={'/dashboard'}>
                                <HStack gap={4}>
                                    <BsHeartFill size={20} />
                                    <Text>Support Tickets</Text>
                                </HStack>
                            </Link>
                            <HStack gap={4} cursor={'pointer'}>
                                <BsPower size={20} />
                                <Text>Log Out</Text>
                            </HStack>
                        </VStack>
                    </Box>
                </Show>
                <Box p={[4, 8, 8]} w={'full'} height={'100vh'} overflowY={'scroll'}>
                    {children}
                </Box>
            </Stack>
        </>
    )
}

export default Layout