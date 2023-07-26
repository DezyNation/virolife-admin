"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import BackendAxios from "@/utils/axios";

const page = () => {
  const Toast = useToast({ position: "top-right" });
  const [invitations, setInvitations] = useState([]);

  function fetchInvitations() {
    BackendAxios.get(`/api/invitations`)
      .then((res) => {
        setInvitations(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err.message,
        });
      });
  }

  function deleteInvitation(id) {
    BackendAxios.delete(`/api/invitations/${id}`)
      .then((res) => {
        Toast({
          status: "success",
          description: "Invitation deleted successfully!",
        });
        fetchInvitations()
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err.message,
        });
      });
  }

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <>
      <Text className="serif" fontSize={"2xl"} textTransform={"capitalize"}>
        Invitations
      </Text>
      <br />
      <TableContainer rounded={"16"} w={"full"}>
        <Table variant={"striped"} colorScheme="gray">
          <Thead bgColor={"yellow.400"}>
            <Tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Sent On</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invitations.map((data, key) => (
              <Tr fontSize={"xs"} key={key}>
                <Td>{key + 1}</Td>
                <Td>{data.name}</Td>
                <Td>{data.email}</Td>
                <Td>{data?.phone_number}</Td>
                <Td>
                  {data?.updated_at
                    ? new Date(data?.updated_at).toDateString()
                    : null}
                </Td>
                <Td>
                  <Button
                    size={"sm"}
                    rounded={"full"}
                    colorScheme="red"
                    onClick={() => deleteInvitation(data?.id)}
                  >
                    DELETE
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default page;
