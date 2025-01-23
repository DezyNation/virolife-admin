"use client";
import BackendAxios from "@/utils/axios";
import {
  Box,
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
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast({ position: "top" });
  const [updateReqId, setUpdateReqId] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  async function fetchData() {
    BackendAxios.get(`/api/admin/cash-points`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast({
          status: "error",
          description: err?.response?.data?.message || err?.message,
        });
      });
  }

  async function handleUpdate() {
    if (status == "rejected" && remarks == "") {
      alert("Please enter remarks for rejection");
      return;
    }
    setIsLoading(true);
    BackendAxios.post(`/api/admin/cash-points/${updateReqId}`, {
      status: status,
      remarks: remarks,
    })
      .then((res) => {
        toast({
          status: "success",
          description: "Request updated successfully!",
        });
        onClose();
        fetchData();
      })
      .catch((err) => {
        onClose();
        toast({
          status: "error",
          description: err?.response?.data?.message || err?.message,
        });
      });
    setIsLoading(false);
  }

  return (
    <>
      <HStack justifyContent={"space-between"}>
        <h1>Cash Points Withdrawals</h1>
        <Button colorScheme="twitter" onClick={onOpen}>
          New Request
        </Button>
      </HStack>
      <br />
      <br />
      <Table>
        <Thead>
          <Tr>
            <Th>Req ID</Th>
            <Th>User</Th>
            <Th>Amount</Th>
            <Th>Created At</Th>
            <Th>Status</Th>
            <Th>Updated At</Th>
            <Th>Remarks</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((item, key) => (
            <Tr key={key}>
              <Td>{item?.id}</Td>
              <Td>
                {item?.user?.name} ({item?.user?.id})
              </Td>
              <Td>{item?.amount}</Td>
              <Td>{item?.created_at}</Td>
              <Td>{item?.status}</Td>
              <Td>{item?.updated_at}</Td>
              <Td>{item?.remarks}</Td>
              <Td>
                {item?.status == "pending" && (
                  <Button
                    colorScheme="twitter"
                    onClick={() => {
                      setUpdateReqId(item?.id);
                      setStatus(item?.status);
                      setRemarks(item?.remarks);
                      onOpen();
                    }}
                  >
                    Update
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Withdrawal Request</ModalHeader>
          <ModalBody>
            <FormLabel>Select Status</FormLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending" disabled>
                Pending
              </option>
              <option value="success">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
            <br />
            {status == "rejected" ? (
              <Box>
                <FormLabel>Remarks</FormLabel>
                <Input
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Box>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button isLoading={isLoading} onClick={handleUpdate}>
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
