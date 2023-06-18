'use client'
import BackendAxios from '@/utils/axios'
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    VStack,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { isExpired } from 'react-jwt'

const Auth = () => {
    const Toast = useToast({ position: 'top-right' })
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [cookies, setCookie] = useCookies(['jwt'])
    const [sessionExpired, setSessionExpired] = useState(false)

    const Formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        if (!isExpired(cookies.jwt)) {
            router.push('/dashboard')
        }
    }, [cookies])

    function handleLogin() {
        if (!Formik.values.email || !Formik.values.password) {
            Toast({
                description: 'Email and password must not be empty'
            })
            return
        }
        BackendAxios.post("/login", { ...Formik.values }).then(res => {
            Toast({
                status: 'success',
                description: 'Login successful!'
            })
            BackendAxios.defaults.headers.common['Authorization'] = `Bearer ${res.data?.access_token}`
            // Cookies.set("jwt", res.data?.access_token)
            setCookie("jwt", res.data?.access_token)
        }).catch(err => {
            Toast({
                status: 'error',
                description: err?.response?.data?.message || err?.response?.data || err?.message
            })
        })
    }


    return (
        <>
            <VStack w={'full'} h={'100vh'} gap={16} justifyContent={'center'}>
                <Image src='/logo.png' w={28} />
                <Box
                    bgColor={'yellow.50'} rounded={12}
                    border={'1px'} borderColor={'yellow.600'}
                    p={8} w={['full', 'sm']}
                >
                    <FormControl mb={8}>
                        <FormLabel>Email</FormLabel>
                        <Input variant={'flushed'} onChange={Formik.handleChange} name='email' />
                    </FormControl>
                    <FormControl mb={8}>
                        <FormLabel>Password</FormLabel>
                        <Input variant={'flushed'} type='password' onChange={Formik.handleChange} name='password' />
                    </FormControl>
                    <HStack w={'full'} gap={8} justifyContent={'flex-end'}>
                        <Button size={'xs'} variant={'unstyled'}>Forgot Password?</Button>
                        <Button colorScheme='yellow' onClick={handleLogin}>Login</Button>
                    </HStack>
                </Box>
            </VStack>


            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Enter OTP
                    </ModalHeader>
                    <ModalBody>
                        <HStack justifyContent={'center'} gap={6} w={'full'}>
                            <PinInput otp>
                                <PinInputField bg={'blanchedalmond'} />
                                <PinInputField bg={'blanchedalmond'} />
                                <PinInputField bg={'blanchedalmond'} />
                                <PinInputField bg={'blanchedalmond'} />
                            </PinInput>
                        </HStack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'} gap={8}>
                            <Button colorScheme='yellow' variant={'outline'}>Resend OTP</Button>
                            <Button colorScheme='yellow' onClick={handleLogin}>Login</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Auth