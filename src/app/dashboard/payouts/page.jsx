'use client'
import PrintButtons from "@/components/dashboard/PrintButtons";
import BackendAxios from "@/utils/axios";
import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import React, { useEffect, useState } from "react";

const page = () => {
  const Toast = useToast();
  const [data, setData] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [requestId, setRequestId] = useState("");
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    getPayoutRequests();
  }, []);

  function getPayoutRequests() {
    BackendAxios.get(`/api/admin/commission-request`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Err while fetching data",
          description:
            err?.response?.data?.message || err?.response?.data || err.message,
        });
      });
  }

  function updatePayout(id, status) {
    if (status == "rejected" && !remarks) {
      Toast({
        description: "Please enter remarks",
      });
    }
    BackendAxios.post(`/api/admin/commission-request/${id}`, {
      status: status,
      remarks: remarks,
    })
      .then((res) => {
        getPayoutRequests();
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Err while updating data",
          description:
            err?.response?.data?.message || err?.response?.data || err.message,
        });
      });
  }

  function handleModal(id) {
    setRequestId(id);
    onToggle();
  }

  return (
    <>
      <Text className="messiri" fontWeight={"semibold"} fontSize={"lg"}>
        Payout Requests
      </Text>
      <br />
      <br />
      <PrintButtons keyword={"payouts"} fileName={"ApprovedPayouts"} />
      <br />
      <TableContainer>
        <Table size={"sm"}>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>User</Th>
              <Th>Requested Amount</Th>
              <Th>Opening Balance</Th>
              <Th>Closing Balance</Th>
              <Th>Remarks</Th>
              <Th>Status</Th>
              <Th>Requested At</Th>
              <Th>Updated At</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((item, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>{item?.name} - {item?.user_id}</Td>
                <Td>{item?.request_amount}</Td>
                <Td>{item?.opening_amount}</Td>
                <Td>{item?.closing_amount}</Td>
                <Td>{item?.remarks}</Td>
                <Td>{item?.status}</Td>
                <Td>{item?.created_at}</Td>
                <Td>{item?.updated_at}</Td>
                <Td>
                  {item?.status == "pending" ? <HStack gap={6}>
                    <Button
                      size={"sm"}
                      colorScheme="yellow"
                      rounded={"full"}
                      onClick={() => updatePayout(item?.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size={"sm"}
                      colorScheme="red"
                      rounded={"full"}
                      onClick={() => handleModal(item?.id)}
                    >
                      Reject
                    </Button>
                  </HStack> : null }
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onToggle}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Request</ModalHeader>
          <ModalBody>
            <Text>Enter Remarks</Text>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Why are you rejecting this request?"
            />
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={'flex-end'} gap={6}>
                <Button onClick={onToggle}>Cancel</Button>
                <Button colorScheme="red" onClick={() => updatePayout(requestId, "rejected")}>Reject Request</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
