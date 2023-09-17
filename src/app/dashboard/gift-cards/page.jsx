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
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { BsPlus } from "react-icons/bs";

const page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [giftCards, setGiftCards] = useState([]);
  const Toast = useToast({ position: "top-right" });

  const [expiryDays, setExpiryDays] = useState("30");

  const plans = [
    { id: 1, amount: 1200 },
    { id: 2, amount: 2400 },
    { id: 3, amount: 3600 },
    { id: 4, amount: 6000 },
    { id: 5, amount: 12000 },
    { id: 6, amount: 18000 },
  ];

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const Formik = useFormik({
    initialValues: {
      code: "",
      userId: "",
      amount: "",
      purpose: "",
      plan: "",
      expiry: "",
      purpose: "",
    },
    onSubmit: (values) => {
      BackendAxios.post(`/api/gift`, values)
        .then((res) => {
          Toast({
            status: "success",
            title: "Gift card created successfully!",
          });
          fetchGiftCards();
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

  useEffect(() => {
    if (Formik.values.purpose == "viroteam-funding") {
      if (Formik.values.plan) {
        const amount = plans.find(
          (plan) => plan.id == Formik.values.plan
        )?.amount;
        Formik.setFieldValue("amount", amount);
      }
    }
    if (Formik.values.purpose == "all-team-process") {
      const amount = 210;
      Formik.setFieldValue("amount", amount);
    }
    if (Formik.values.purpose == "primary-group") {
      const amount = 250;
      Formik.setFieldValue("amount", amount);
    }
    if (Formik.values.purpose == "secondary-group") {
      const amount = 500;
      Formik.setFieldValue("amount", amount);
    }
  }, [Formik.values.purpose, Formik.values.plan]);

  // useEffect(() => {
  //   const date = new Date();
  //   Formik.setFieldValue("expiry", new Date(date.setDate(date.getDate() + expiryDays)).toLocaleString());
  // }, [expiryDays]);

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
    Formik.setFieldValue("code", randomNum);
  }

  function verifyUser() {
    if (!Formik.values.userId) {
      Toast({
        description: "Please enter User ID",
      });
      return;
    }
    BackendAxios.get(`/api/users/${Formik.values.userId}`)
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

  function deleteGiftCard(id) {
    BackendAxios.delete(`/api/gift/${id}`)
      .then((res) => {
        Toast({
          status: "success",
          description: "Successfully deleted Gift Card",
        });
        fetchGiftCards();
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
              {/* <Th>Amount</Th> */}
              <Th>Purpose</Th>
              <Th>Status</Th>
              <Th>Linked User</Th>
              <Th>Created At</Th>
              <Th>Expires At</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {giftCards?.map((item, key) => (
              <Tr key={key}>
                <Td>{key + 1}</Td>
                <Td>{item?.code}</Td>
                {/* <Td>{item?.amount}</Td> */}
                <Td>{item?.purpose}</Td>
                <Td>{item?.redeemed ? "USED" : "PENDING"}</Td>
                <Td>{item?.user_id}</Td>
                <Td>
                  {item?.created_at
                    ? new Date(item?.created_at).toLocaleDateString()
                    : ""}
                </Td>
                <Td>{item?.expiry_at}</Td>
                <Td>
                  <Button
                    size={"xs"}
                    colorScheme="red"
                    onClick={() => deleteGiftCard(item?.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
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
              <FormLabel>Purpose</FormLabel>
              <Select
                placeholder="Please Select"
                name="purpose"
                onChange={Formik.handleChange}
              >
                <option value="viroteam-funding">Viro Team Funding</option>
                <option value="all-team-process">All Team Processing</option>
                <option value="primary-group">Primary Group</option>
                <option value="secondary-group">Secondary Group</option>
              </Select>
            </FormControl>
            {Formik.values.purpose == "viroteam-funding" ? (
              <FormControl mb={8}>
                <FormLabel>Select Plan</FormLabel>
                <Select
                  placeholder="Please Select"
                  name="plan"
                  onChange={Formik.handleChange}
                >
                  <option value="1">Plan A</option>
                  <option value="2">Plan B</option>
                  <option value="3">Plan D</option>
                  <option value="4">Plan E</option>
                  <option value="5">Plan F</option>
                  <option value="6">Plan G</option>
                </Select>
              </FormControl>
            ) : null}
            <FormControl mb={8}>
              <FormLabel>Card No.</FormLabel>
              <HStack>
                <Input
                  name="code"
                  value={Formik.values.code}
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
                    name="userId"
                    placeholder="Enter User ID"
                    value={Formik.values.userId}
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
              {/* <HStack gap={6}>
                <Button
                  colorScheme={expiryDays == 30 ? "yellow" : "gray"}
                  rounded={"full"}
                  onClick={() => setExpiryDays(30)}
                >
                  30 Days
                </Button>
                <Button
                  colorScheme={expiryDays == 60 ? "yellow" : "gray"}
                  onClick={() => setExpiryDays(60)}
                  rounded={"full"}
                >
                  60 Days
                </Button>
              </HStack> */}
              <Input type="date" name="expiry" onChange={Formik.handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter justifyContent={"flex-end"} gap={4}>
            <Button onClick={onClose}>Cancel</Button>
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
