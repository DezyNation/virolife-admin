'use client'
import React, { useState } from 'react'
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
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel
} from '@chakra-ui/react'
import Link from 'next/link'
import { BsDownload, BsPlus } from 'react-icons/bs'

const Users = () => {
    const arr = [1, 1, 1, 1, 1, 1, 2, 0]

    const { onOpen, onClose, isOpen } = useDisclosure()
    const [videoType, setVideoType] = useState("bunny")

    function handleSave(){
        onClose()
    }

    return (
        <>
            <HStack justifyContent={['space-between']} py={8}>
                <Text className='serif' fontSize={'2xl'} textTransform={'capitalize'}>Videos</Text>
                <HStack alignItems={'flex-end'}>
                    <Input placeholder={'Search Videos'} />
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
                                <Th>Title</Th>
                                <Th>Points</Th>
                                <Th>Link</Th>
                                <Th>Type</Th>
                                <Th>Views</Th>
                                <Th>Timestamp</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                arr.map((item, key) => (
                                    <Tr fontSize={'xs'} key={key}>
                                        <Td>{key + 1}</Td>
                                        <Td>Real Fruit Juice</Td>
                                        <Td>120</Td>
                                        <Td>
                                            <Link href={'https://www.youtube.com/watch?v=5IqHGB9_N50'} target={'_blank'}>
                                                Click to View
                                            </Link>
                                        </Td>
                                        <Td>{key % 3 == 0 ? "Bunny" : "Link"}</Td>
                                        <Td>54853</Td>
                                        <Td>28-05-2023 18:23</Td>
                                        <Td>
                                            <HStack gap={4}>
                                                <Switch defaultChecked={true} colorScheme='yellow' />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Stack>

            <Button
                rounded={'full'} boxSize={12}
                display={'grid'} placeContent={'center'}
                colorScheme={'twitter'} pos={'fixed'}
                bottom={16} right={16}
                onClick={onOpen}
            >
                <BsPlus fontSize={28} />
            </Button>




            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Add New Video
                    </ModalHeader>
                    <ModalBody>
                        <Text fontWeight={'500'} pb={4}>Video Type</Text>
                        <HStack>
                            <Button
                                colorScheme='twitter' variant={videoType == "bunny" ? 'solid' : 'outline'}
                                onClick={() => setVideoType("bunny")}
                            >Bunny Link</Button>
                            <Button
                                colorScheme='twitter' variant={videoType == "other" ? 'solid' : 'outline'}
                                onClick={() => setVideoType("other")}
                            >Other Link</Button>
                        </HStack>
                        <br />

                        <FormControl pb={4}>
                            <FormLabel>Link</FormLabel>
                            <Input />
                        </FormControl>

                        <FormControl pb={4}>
                            <FormLabel>Title</FormLabel>
                            <Input />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Points</FormLabel>
                            <Input type={'number'} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'}>
                            <Button colorScheme='twitter' onClick={handleSave}>Save Video</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Users