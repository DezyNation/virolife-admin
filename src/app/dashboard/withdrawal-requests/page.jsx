"use client";
import BackendAxios from "@/utils/axios";
import useApiHandler from "@/utils/hooks/useApiHandler";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const page = () => {
  const { handleError } = useApiHandler();
  const Toast = useToast();

  const [data, setData] = useState([]);

  const [status, setStatus] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [updatedData, setUpdatedData] = useState({
    transaction_date: "",
    transaction_id: "",
    channel: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
  }, [status]);

  function fetchData() {
    BackendAxios.get(`/api/admin/campaign-withdrawal-request?status=${status}`)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {
        handleError(err, "Error while fetching requests");
      });
  }

  function updateData() {
    BackendAxios.put(`api/admin/campaign-withdrawal-request/${campaignId}`, {
      ...updatedData,
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Request updated successfully!",
        });
        setCampaignId(null);
      })
      .catch((err) => {
        handleError(err, "Error while updating request");
      });
  }

  return (
    <>
      <Text fontSize={["xl", "xl"]} fontWeight={"semibold"}>
        Campaign Withdrawals
      </Text>
      <br />
      <br />
      <HStack mb={4} justifyContent={"flex-end"}>
        <Button
          size={"sm"}
          onClick={() => setStatus("")}
          colorScheme="yellow"
          rounded={"full"}
          variant={status == "" ? "solid" : "outline"}
        >
          All
        </Button>
        <Button
          size={"sm"}
          onClick={() => setStatus("pending")}
          colorScheme="yellow"
          rounded={"full"}
          variant={status == "pending" ? "solid" : "outline"}
        >
          Pending
        </Button>
        <Button
          size={"sm"}
          onClick={() => setStatus("approved")}
          colorScheme="yellow"
          rounded={"full"}
          variant={status == "approved" ? "solid" : "outline"}
        >
          Approved
        </Button>
        <Button
          size={"sm"}
          onClick={() => setStatus("rejected")}
          colorScheme="yellow"
          rounded={"full"}
          variant={status == "rejected" ? "solid" : "outline"}
        >
          Rejected
        </Button>
      </HStack>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Campaign</Th>
              <Th>User</Th>
              <Th>Amount</Th>
              <Th>Requested At</Th>
              <Th>Status</Th>
              <Th>Transaction ID</Th>
              <Th>Channel</Th>
              <Th>Trnxn Timestamp</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((item, key) => (
              <Tr>
                <Td>{key + 1}</Td>
                <Td>
                  ({item?.campaign_id}) - {item?.campaign_title}
                </Td>
                <Td>
                  ({item?.user_id}) - {item?.user_name}
                </Td>
                <Td>₹{item?.amount}</Td>
                <Td>{item?.created_at}</Td>
                <Td>{item?.status}</Td>
                <Td>{item?.transaction_id}</Td>
                <Td>{item?.channel}</Td>
                <Td>{item?.transaction_timestamp}</Td>
                <Td>
                  {item?.status == "pending" ? (
                    <Button
                      size={"sm"}
                      onClick={() => {
                        setUpdatedData((prev) => ({
                          ...prev,
                          status: item?.status,
                        }));
                        setCampaignId(item?.id);
                      }}
                    >
                      Update
                    </Button>
                  ) : null}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={Boolean(campaignId)} onClose={() => setCampaignId(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Withdrawal Request</ModalHeader>
          <ModalBody>
            <FormControl maxW={["full", "xs"]}>
              <FormLabel>Please select status</FormLabel>
              <Select
                placeholder="Choose Status"
                value={updatedData?.status}
                onChange={(e) =>
                  setUpdatedData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="pending">Pending</option>
                <option value="approved">Approve Request</option>
                <option value="rejected">Reject Request</option>
              </Select>
            </FormControl>

            {updatedData?.status == "approved" ? (
              <FormControl w={["full", "xs"]} mt={4}>
                <FormLabel>Enter Trnxn ID</FormLabel>
                <Input
                  value={updatedData?.transaction_id}
                  onChange={(e) =>
                    setUpdatedData((prev) => ({
                      ...prev,
                      transaction_id: e.target.value,
                    }))
                  }
                />
              </FormControl>
            ) : null}

            {updatedData?.status == "approved" ? (
              <FormControl w={["full", "xs"]} mt={4}>
                <FormLabel>Enter Trnxn Channel</FormLabel>
                <Input
                  value={updatedData?.channel}
                  onChange={(e) =>
                    setUpdatedData((prev) => ({
                      ...prev,
                      channel: e.target.value,
                    }))
                  }
                  placeholder="e.g., UPI / Bank Transfer etc."
                />
              </FormControl>
            ) : null}

            {updatedData?.status == "approved" ? (
              <FormControl w={["full", "xs"]} mt={4}>
                <FormLabel>Enter Trnxn Date</FormLabel>
                <Input
                  type="date"
                  value={updatedData?.transaction_date}
                  onChange={(e) =>
                    setUpdatedData((prev) => ({
                      ...prev,
                      transaction_date: e.target.value,
                    }))
                  }
                />
              </FormControl>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <HStack w={"full"} justifyContent={"flex-end"}>
              <Button onClick={() => setCampaignId(null)}>Cancel</Button>
              <Button colorScheme="whatsapp" onClick={() => updateData()}>
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
