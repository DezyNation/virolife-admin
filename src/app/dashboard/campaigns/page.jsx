'use client'
import React, { useState } from 'react'
import { Box, Stack, Text, Button, HStack, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Textarea, ModalFooter } from '@chakra-ui/react'
import CampaignCard from '@/components/campaign/CampaignCard'
import { BsPlus } from 'react-icons/bs'
import Link from 'next/link'

const Page = () => {
    const dummyCampaigns = [
        {
            id: '1',
            title: 'save our cows',
            userName: 'john doe',
            coverImage: 'https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '2',
            title: 'help me heal',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '3',
            title: 'save your future',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '4',
            title: 'education funds',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '5',
            title: 'startup funds',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
        {
            id: '6',
            title: 'travel funds',
            userName: 'john doe',
            coverImage: 'https://www.hippo.co.za/globalassets/images/blog/your-guide-to-switching-medical-aid/medical-aid-2.jpg',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore illo quos facere asperiores. Nulla harum unde praesentium hic aut nisi iusto recusandae, beatae aspernatur.'
        },
    ]
    const [showPopup, setShowPopup] = useState(false)
    const [action, setAction] = useState("")

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Text
                    className='serif' fontSize={'2xl'}
                    mb={12}
                >Manage Campaigns</Text>
                <HStack>
                    <Input w={[64]} placeholder='Search Campaigns' />
                    <Button colorScheme='yellow'>Search</Button>
                </HStack>
            </Stack>
            <Text py={4}>Pending For Approval</Text>
            <Stack
                direction={['column', 'row']} flexWrap={'wrap'}
                gap={[4, 8, 16]} justifyContent={'flex-start'}
            >
                {
                    dummyCampaigns.map((campaign, key) => (
                        <CampaignCard
                            coverImage={campaign.coverImage}
                            title={campaign.title}
                            userName={campaign.userName}
                            description={campaign.description}
                            onClick={() => setShowPopup(true)}
                        />
                    ))
                }
            </Stack>


            <Modal
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Approve or Reject
                    </ModalHeader>
                    <ModalBody>
                        <Text>Action</Text>
                        <HStack>
                            <Button
                                colorScheme='red' variant={action == "reject" ? 'solid' : 'outline'}
                                onClick={() => setAction("reject")}
                            >Reject</Button>
                            <Button
                                colorScheme='whatsapp' variant={action == "approve" ? 'solid' : 'outline'}
                                onClick={() => setAction("approve")}
                            >Approve</Button>
                        </HStack>
                        <br />
                        <Text>Remarks</Text>
                        <Textarea w={['full']} h={'28'} resize={'none'} />
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'}>
                            <Button colorScheme='twitter'>Save</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Page