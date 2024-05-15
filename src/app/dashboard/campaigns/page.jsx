"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  HStack,
  ModalBody,
  ModalFooter,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import CampaignCard from "@/components/campaign/CampaignCard";
import {
  BsEye,
  BsPencil,
  BsPlus,
  BsTrash2Fill,
  BsTrashFill,
} from "react-icons/bs";
import Link from "next/link";
import BackendAxios from "@/utils/axios";

const Page = () => {
  const Toast = useToast({ position: "top-right" });
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [status, setStatus] = useState("pending");
  const [remarks, setRemarks] = useState("");
  const { onToggle, isOpen } = useDisclosure();
  const [filter, setFilter] = useState("all");

  function fetchData() {
    BackendAxios.get(`/api/admin/campaigns/${filter}`)
      .then((res) => {
        setCampaigns(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }
  useEffect(() => {
    fetchData();
  }, [filter]);

  function handleCampaignSelection(id, status) {
    setSelectedCampaign(id);
    setStatus(status);
    onToggle();
  }

  function handleUpdate() {
    if (status == "delete") {
      BackendAxios.delete(`/api/campaign/${selectedCampaign}`)
        .then((res) => {
          Toast({
            status: "success",
            description: "Campaign deleted successfully!",
          });
          onToggle();
          fetchData();
        })
        .catch((err) => {
          Toast({
            status: "error",
            description:
              err?.response?.data?.message ||
              err?.response?.data ||
              err?.message,
          });
        });
      return;
    }
    BackendAxios.put(`/api/campaign/${selectedCampaign}`, { status: status })
      .then((res) => {
        Toast({
          status: "success",
          description: "Campaign updated successfully!",
        });
        onToggle();
        setStatus("pending");
        fetchData();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  return (
    <>
      <Stack direction={["column", "row"]} justifyContent={"space-between"}>
        <Text
          className="serif"
          fontSize={"2xl"}
          fontWeight={"semibold"}
          mb={12}
        >
          Manage Campaigns
        </Text>
        <HStack gap={4}>
          <Text>Filters: </Text>
          <Button
            variant={filter == "all" ? "solid" : "outline"}
            size={"sm"}
            colorScheme="yellow"
            rounded={"full"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter == "pending" ? "solid" : "outline"}
            size={"sm"}
            colorScheme="yellow"
            rounded={"full"}
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter == "paused" ? "solid" : "outline"}
            size={"sm"}
            colorScheme="yellow"
            rounded={"full"}
            onClick={() => setFilter("paused")}
          >
            Paused
          </Button>
          <Button
            variant={filter == "approved" ? "solid" : "outline"}
            size={"sm"}
            colorScheme="yellow"
            rounded={"full"}
            onClick={() => setFilter("approved")}
          >
            Approved
          </Button>
        </HStack>
      </Stack>

      {/* <Stack
        direction={["column", "row"]}
        flexWrap={"wrap"}
        gap={[4, 8, 16]}
        justifyContent={"flex-start"}
      >
        {campaigns
          .filter((item) => {
            if (filter == "all") return item;
            else return item?.status?.toLowerCase() == filter;
          })
          .map((campaign, key) => (
            <CampaignCard
              key={key}
              coverImage={
                campaign.file_path
                  ? `https://api.virolife.in/${campaign.file_path}`
                  : "https://idea.batumi.ge/files/default.jpg"
              }
              title={campaign.title}
              userName={campaign.user_id}
              status={campaign?.status}
              description={campaign.description}
              onClick={() =>
                handleCampaignSelection(campaign?.id, campaign?.status)
              }
            />
          ))}
      </Stack> */}

      <TableContainer>
        <Table variant={"striped"} colorScheme="gray">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>User</Th>
              <Th>Status</Th>
              <Th>Timestamp</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {campaigns.map((campaign, key) => (
              <Tr key={key}>
                <Td>{campaign?.id}</Td>
                <Td>{campaign?.title}</Td>
                <Td>{campaign?.user_id}</Td>
                <Td>{campaign?.status}</Td>
                <Td>{new Date(campaign?.created_at).toLocaleDateString()}</Td>
                <Td>
                  <HStack>
                    <Button
                      size={"sm"}
                      rounded={"full"}
                      colorScheme="yellow"
                      onClick={() =>
                        handleCampaignSelection(campaign?.id, campaign?.status)
                      }
                    >
                      Update
                    </Button>
                    <Link
                      href={`/dashboard/campaigns/view/${campaign?.id}`}
                      target="_blank"
                    >
                      <Button
                        size={"sm"}
                        rounded={"full"}
                        colorScheme="twitter"
                      >
                        View
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/campaigns/edit/${campaign?.id}`}
                      target="_blank"
                    >
                      <Button
                        size={"sm"}
                        rounded={"full"}
                        colorScheme="whatsapp"
                      >
                        Edit
                      </Button>
                    </Link>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onToggle}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack justifyContent={"space-between"}>
              <Text>Update Status</Text>
              <Link
                href={`/dashboard/campaigns/view/${selectedCampaign}`}
                target="_blank"
              >
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  colorScheme="twitter"
                  leftIcon={<BsEye />}
                >
                  View
                </Button>
              </Link>
              <Link
                href={`/dashboard/campaigns/edit/${selectedCampaign}`}
                target="_blank"
              >
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  colorScheme="twitter"
                  leftIcon={<BsPencil />}
                >
                  Edit
                </Button>
              </Link>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Stack direction={"column"} spacing={4}>
              <Text>
                Select any option to change the status of this campaign.
              </Text>
              <HStack py={4} spacing={6}>
                <Button
                  onClick={() => setStatus("paused")}
                  colorScheme="facebook"
                  size={"sm"}
                  variant={status === "paused" ? "solid" : "outline"}
                  rounded={"full"}
                >
                  Pause
                </Button>
                <Button
                  onClick={() => setStatus("rejected")}
                  colorScheme="orange"
                  size={"sm"}
                  variant={status === "rejected" ? "solid" : "outline"}
                  rounded={"full"}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => setStatus("approved")}
                  colorScheme="whatsapp"
                  size={"sm"}
                  variant={status === "approved" ? "solid" : "outline"}
                  rounded={"full"}
                >
                  Approve
                </Button>
                <Button
                  onClick={() => setStatus("delete")}
                  colorScheme="red"
                  size={"sm"}
                  variant={status === "delete" ? "solid" : "outline"}
                  rounded={"full"}
                  leftIcon={<BsTrashFill />}
                >
                  Delete
                </Button>
              </HStack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button colorScheme="twitter" onClick={handleUpdate}>
                Save
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Page;
