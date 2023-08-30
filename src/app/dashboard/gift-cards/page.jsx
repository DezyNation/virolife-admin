"use client";
import BackendAxios from "@/utils/axios";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
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
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { BsPlus } from "react-icons/bs";

const page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [giftCards, setGiftCards] = useState([]);
  const Toast = useToast({ position: "top-right" });

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const Formik = useFormik({
    initialValues: {
      cardNumber: "",
      linkedUser: "",
      amount: "",
      purpose: "",
      expiresAt: "",
    },
    onSubmit: (values) => {
      BackendAxios.post(`/api/gift`, values)
        .then((res) => {
          Toast({
            status: "success",
            title: "Gift card created successfully!",
          });
          fetchGiftCards()
          onClose();
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
    },
  });

  function fetchGiftCards() {
    BackendAxios.get(`/api/gift`)
      .then((res) => {
        setGiftCards(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  //   Generate random 6-digit gift card number
  function generateGiftCard() {
    const min = 100000;
    const max = 999999;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    Formik.setFieldValue("cardNumber", randomNum);
  }

  function verifyUser() {
    if (!Formik.values.linkedUser) {
      Toast({
        description: "Please enter User ID",
      });
      return;
    }
    BackendAxios.get(`/api/users/${Formik.values.linkedUser}`)
      .then((res) => {
        if (res.data?.length) {
          Toast({
            title: res.data[0]?.name,
            description: `Ph. ${res.data[0]?.phone_number || "NA"}`,
          });
        } else {
          Toast({
            description: "User not found!",
          });
        }
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
      <Text fontSize={"lg"}>Manage Gift Cards</Text>
      <br />
      <br />

      <TableContainer>
        <Table size={"sm"} variant={"striped"} colorScheme="yellow">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Card No.</Th>
              <Th>Amount</Th>
              <Th>Purpose</Th>
              <Th>Status</Th>
              <Th>Linked User</Th>
              <Th>Created At</Th>
              <Th>Expires At</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <IconButton
        colorScheme="twitter"
        rounded={"full"}
        icon={<BsPlus size={24} />}
        pos={"fixed"}
        bottom={8}
        right={8}
        onClick={onOpen}
      />

      {/* Gift Card Creation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Gift Card</ModalHeader>
          <ModalBody>
            <FormControl mb={8}>
              <FormLabel>Card No.</FormLabel>
              <HStack>
                <Input
                  name="cardNumber"
                  value={Formik.values.cardNumber}
                  onChange={Formik.handleChange}
                />
                <Button size={"xs"} onClick={generateGiftCard}>
                  Random
                </Button>
              </HStack>
            </FormControl>
            <FormControl mb={8}>
              <FormLabel>Amount</FormLabel>
              <Input
                name="amount"
                value={Formik.values.amount}
                onChange={Formik.handleChange}
              />
            </FormControl>
            <FormControl mb={8}>
              <FormLabel>Authorised User</FormLabel>
              <HStack>
                <InputGroup>
                  <InputLeftAddon children={"VCF"} />
                  <Input
                    name="linkedUser"
                    placeholder="Enter User ID"
                    value={Formik.values.linkedUser}
                    onChange={Formik.handleChange}
                  />
                </InputGroup>
                <Button size={"xs"} onClick={verifyUser}>
                  Verify
                </Button>
              </HStack>
            </FormControl>
            <FormControl mb={8}>
              <FormLabel>Expiry</FormLabel>
              <Input
                type="date"
                name="expiresAt"
                value={Formik.values.expiresAt}
                onChange={Formik.handleChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter justifyContent={"flex-end"} gap={4}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="twitter" onClick={Formik.handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
