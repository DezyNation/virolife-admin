'use client'
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
    useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Auth = () => {
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()

    function handleLogin(){
        router.push("/dashboard")
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
                        <Input variant={'flushed'} name='email' />
                    </FormControl>
                    <FormControl mb={8}>
                        <FormLabel>Password</FormLabel>
                        <Input variant={'flushed'} type='password' name='password' />
                    </FormControl>
                    <HStack w={'full'} gap={8} justifyContent={'flex-end'}>
                        <Button size={'xs'} variant={'unstyled'}>Forgot Password?</Button>
                        <Button colorScheme='yellow' onClick={onOpen}>Send OTP</Button>
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