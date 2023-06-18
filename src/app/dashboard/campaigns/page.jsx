'use client'
import React, { useEffect, useState } from 'react'
import { Box, Stack, Text, Button, useToast, useDisclosure, Modal, ModalContent, ModalOverlay, ModalHeader, HStack, ModalBody, ModalFooter } from '@chakra-ui/react'
import CampaignCard from '@/components/campaign/CampaignCard'
import { BsEye, BsPlus } from 'react-icons/bs'
import Link from 'next/link'
import BackendAxios from '@/utils/axios'

const Page = () => {
    const Toast = useToast({ position: 'top-right' })
    const [campaigns, setCampaigns] = useState([])
    const [selectedCampaign, setSelectedCampaign] = useState("")
    const [status, setStatus] = useState("pending")
    const [remarks, setRemarks] = useState("")
    const { onToggle, isOpen } = useDisclosure()

    function fetchData() {
        BackendAxios.get("/api/campaign").then(res => {
            setCampaigns(res.data)
        }).catch(err => {
            Toast({
                status: 'error',
                description: err?.response?.data?.message || err?.response?.data || err?.message
            })
        })
    }
    useEffect(() => {
        fetchData()
    }, [])

    function handleCampaignSelection(id, status) {
        setSelectedCampaign(id)
        setStatus(status)
        onToggle()
    }

    function handleUpdate(){
        BackendAxios.put(`/api/campaign/${selectedCampaign}`, 
        {status: status})
        .then(res => {
            Toast({
                status: 'success',
                description: "Campaign updated successfully!"
            })
            onToggle()
            setStatus("pending")
            fetchData()
        }).catch(err =>{
            Toast({
                status: 'error',
                description: err?.response?.data?.message || err?.response?.data || err?.message
            })
        })
    }

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Text
                    className='serif' fontSize={'2xl'}
                    fontWeight={'semibold'} mb={12}
                >Manage Campaigns</Text>
            </Stack>
            <Stack
                direction={['column', 'row']} flexWrap={'wrap'}
                gap={[4, 8, 16]} justifyContent={'flex-start'}
            >
                {
                    campaigns.map((campaign, key) => (
                        <CampaignCard
                            key={key}
                            coverImage={campaign.file_path ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${campaign.file_path}` : "https://idea.batumi.ge/files/default.jpg"}
                            title={campaign.title}
                            userName={campaign.user_id}
                            status={campaign?.status}
                            description={campaign.description}
                            onClick={() => handleCampaignSelection(campaign?.id, campaign?.status)}
                        />
                    ))
                }
            </Stack>

            <Modal
                isOpen={isOpen}
                onClose={onToggle}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <HStack justifyContent={'space-between'}>
                            <Text>Approve or Reject</Text>
                            <Link href={`/dashboard/campaigns/view/${selectedCampaign}`}>
                                <Button size={'sm'} variant={'ghost'} colorScheme='twitter' leftIcon={<BsEye />}>View</Button>
                            </Link>
                        </HStack>
                    </ModalHeader>
                    <ModalBody>
                        <Stack direction={'column'} spacing={4}>
                            <Text>Are you sure you want to update status of this campaign?</Text>
                            <HStack py={4} spacing={8}>
                                <Button onClick={()=>setStatus("rejected")} colorScheme='red' variant={status === "rejected" ? "solid" : "outline"}>Reject</Button>
                                <Button onClick={()=>setStatus("approved")} colorScheme='whatsapp' variant={status === "approved" ? "solid" : "outline"}>Approve</Button>
                            </HStack>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack justifyContent={'flex-end'}>
                            <Button colorScheme='twitter' onClick={handleUpdate}>Save</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Page