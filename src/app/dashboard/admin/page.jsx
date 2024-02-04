"use client";
import React, { useEffect, useState } from "react";
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
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormLabel,
  ModalFooter,
  Image,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  CheckboxGroup,
  Checkbox,
  DrawerCloseButton,
} from "@chakra-ui/react";
import Link from "next/link";
import { BsDownload, BsEye, BsPlus } from "react-icons/bs";
import BackendAxios from "@/utils/axios";
import QRCode from "react-qr-code";
import TreeModal from "@/components/dashboard/users/TreeModal";

const Users = () => {
  const [permissionsDrawer, setPermissionsDrawer] = useState({
    id: "",
    name: "",
    status: false,
    onSubmit: () => {
      Toast({
        status: "success",
        description: "Permissions saved successfully!",
      });
    },
  });
  const Toast = useToast({ position: "top-right" });
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const { isOpen, onToggle } = useDisclosure();
  const [userInfo, setUserInfo] = useState({});
  const [qrVisible, setQrVisible] = useState({ status: false, upi: "" });

  const [groupMembers, setGroupMembers] = useState([]);
  const [showTreeModal, setShowTreeModal] = useState(false);

  const [selectedUserPermissions, setSelectedUserPermissions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState([]);

  function showQr(upi) {
    if (!upi) {
      Toast({
        description: "UPI ID is not available for this user.",
      });
      return;
    }
    setQrVisible({ status: true, upi: upi });
  }

  function fetchUsers() {
    BackendAxios.get("/api/admin/users-list/admin")
      .then((res) => {
        setUsers(res.data);
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
    fetchUsers();
  }, []);

  function getUserInfo(id) {
    onToggle();
    BackendAxios.get(`/api/users/${id}`)
      .then((res) => {
        setUserInfo(res.data[0]);
      })
      .catch((err) => {
        onToggle();
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function updateUser(id, obj) {
    BackendAxios.post(`/api/admin/update-user/${id}`, { ...obj })
      .then((res) => {
        Toast({
          status: "success",
          description: "User updated successfully!",
        });
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function searchUser() {
    BackendAxios.get(`/api/admin/find-user?search=${query}`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function updateUserRole(id, role) {
    BackendAxios.post(`/api/admin/change-role/${id}`, { role: role })
      .then((res) => {
        onToggle();
        Toast({
          status: "success",
          description: `The user role was updated successfully!`,
        });
        fetchUsers();
      })
      .catch((err) => {
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }

  function handlePermissions() {
    BackendAxios.post(`/api/admin/assign-permissions/${permissionsDrawer.id}`, {
      permissions: selectedUserPermissions,
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Permissions were updated successfully!",
        });
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
    if (permissionsDrawer.status) {
      getUserPermissions();
    }
  }, [permissionsDrawer]);

  function getUserPermissions() {
    BackendAxios.get(`/api/admin/user-permissions/${permissionsDrawer.id}`)
      .then((res) => {
        setSelectedUserPermissions(
          res.data?.map((permission) => permission?.name)
        );
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
      <HStack justifyContent={["space-between"]} py={8}>
        <Text className="serif" fontSize={"2xl"} textTransform={"capitalize"}>
          Admin Employees
        </Text>
        <HStack alignItems={"flex-end"}>
          <Input
            placeholder={"Search Users"}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button colorScheme={"yellow"} onClick={searchUser}>
            Search
          </Button>
        </HStack>
      </HStack>
      <Stack
        w={"full"}
        direction={["column"]}
        justifyContent={"space-between"}
        gap={8}
      >
        <TableContainer rounded={"16"} w={"full"}>
          <Table variant={"striped"} colorScheme="gray">
            <TableCaption>Users on Virolife</TableCaption>
            <Thead bgColor={"yellow.400"}>
              <Tr>
                <Th>#</Th>
                <Th>ID</Th>
                <Th className="sticky-left">User Name</Th>
                <Th>Contact</Th>
                <Th>Donation Collected</Th>
                <Th>Date of Birth</Th>
                {/* <Th>Role</Th> */}
                <Th>Registered On</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user, key) => (
                <Tr fontSize={"xs"} key={key}>
                  <Td>{key + 1}</Td>
                  <Td>VCF{user?.id}</Td>
                  <Td className="sticky-left">
                    {user?.name} ({user?.gender})
                  </Td>
                  <Td>
                    <Box>
                      <p>{user?.email}</p>
                      <p>+91 {user?.phone_number}</p>
                    </Box>
                  </Td>
                  <Td>{user?.wallet}</Td>
                  <Td>
                    {user?.dob ? new Date(user?.dob).toDateString() : null}
                  </Td>
                  {/* <Td>{user?.role_name}</Td> */}
                  <Td>{new Date(user?.created_at).toLocaleString()}</Td>
                  <Td>
                    <HStack gap={4} pb={2}>
                      <Switch
                        defaultChecked={user?.active}
                        colorScheme="yellow"
                        onChange={(e) =>
                          updateUser(user?.id, { active: e.target.checked })
                        }
                      />
                      <Button
                        size={"xs"}
                        colorScheme={"teal"}
                        leftIcon={<BsEye />}
                        onClick={() => getUserInfo(user?.id)}
                      >
                        View
                      </Button>
                      {/* <Link
                        href={`/dashboard/admin/edit/${user?.id}`}
                        target="_blank"
                      >
                        <Button size={"xs"} colorScheme="twitter">
                          Edit
                        </Button>
                      </Link> */}
                      <Button
                        size={"xs"}
                        colorScheme="twitter"
                        onClick={() =>
                          setPermissionsDrawer({
                            id: user?.id,
                            name: user?.name,
                            status: true,
                          })
                        }
                      >
                        Permissions
                      </Button>
                    </HStack>
                    {/* <HStack pt={2}>
                    <Button
                      size={"xs"}
                      colorScheme={"yellow"}
                      onClick={() => viewPrimaryTree(user?.id, user?.name)}
                      >
                      Prim. Tree
                    </Button>
                    <Button
                      size={"xs"}
                      colorScheme={"orange"}
                      onClick={() => viewSecondaryTree(user?.id, user?.name)}
                      >
                      Sec. Tree
                    </Button>
                      </HStack> */}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>

      <Link href={"/dashboard/users/create"}>
        <Button
          position={"fixed"}
          bottom={4}
          right={4}
          colorScheme="twitter"
          zIndex={9999}
          rounded={"full"}
          leftIcon={<BsPlus size={24} />}
        >
          Create New
        </Button>
      </Link>

      {/* User Info Modal */}
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onToggle}
        size={["full", "3xl"]}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={8}>
            <HStack w={"full"} justifyContent={"space-between"}>
              <HStack gap={8}>
                <Avatar src={userInfo?.profile} name={userInfo?.name} />
                <Text>{userInfo?.name}</Text>
              </HStack>
              {/* <Button
                colorScheme="twitter"
                onClick={() =>
                  updateUserRole(
                    userInfo?.id,
                    userInfo?.role_name == "admin" ? "user" : "admin"
                  )
                }
              >
                Make {userInfo?.role_name == "admin" ? "User" : "Admin"}
              </Button> */}
            </HStack>
          </ModalHeader>
          <ModalBody p={8}>
            <Text fontSize={"lg"} fontWeight={"semibold"}>
              Basic Details
            </Text>
            <hr />
            <br />
            <Stack direction={["column", "row"]}>
              <Box flex={1}>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Email</Text>
                  <Text>{userInfo?.email}</Text>
                </HStack>

                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Phone</Text>
                  <Text>{userInfo?.phone_number}</Text>
                </HStack>

                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Joined On</Text>
                  <Text>{userInfo?.created_at}</Text>
                </HStack>

                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>D.o.B</Text>
                  <Text>{userInfo?.dob}</Text>
                </HStack>
              </Box>
              <Box flex={1}>
                <Text fontWeight={"semibold"}>Address</Text>
                <Text>
                  Street:{" "}
                  {userInfo?.address
                    ? JSON.parse(userInfo?.address)?.street
                    : null}
                </Text>
                <Text>
                  City:{" "}
                  {userInfo?.address
                    ? JSON.parse(userInfo?.address)?.city
                    : null}
                </Text>
                <Text>
                  Pincode:{" "}
                  {userInfo?.address
                    ? JSON.parse(userInfo?.address)?.pincode
                    : null}
                </Text>
                <Text>
                  Landmark:{" "}
                  {userInfo?.address
                    ? JSON.parse(userInfo?.address)?.landmark
                    : null}
                </Text>
              </Box>
            </Stack>
            <br />
            <br />
            <Text fontSize={"lg"} fontWeight={"semibold"}>
              Financial Details
            </Text>
            <hr />
            <br />
            <Stack direction={["column", "row"]}>
              <Box flex={1}>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Account No.:</Text>
                  <Text>{userInfo?.account_number}</Text>
                </HStack>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>Bank Name:</Text>
                  <Text>{userInfo?.bank_name}</Text>
                </HStack>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>IFSC:</Text>
                  <Text>{userInfo?.ifsc}</Text>
                </HStack>
              </Box>
              <Box flex={1}>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>MICR:</Text>
                  <Text>{userInfo?.micr}</Text>
                </HStack>
                <HStack gap={6}>
                  <Text fontWeight={"semibold"}>UPI:</Text>
                  <Text>{userInfo?.upi_id}</Text>
                </HStack>
                <br />
                <Button
                  size={"sm"}
                  rounded={"full"}
                  onClick={() => showQr(userInfo?.upi_id)}
                >
                  View UPI QR Code
                </Button>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* UPI Modal */}
      <Modal
        size={"xs"}
        isOpen={qrVisible.status}
        onClose={() => setQrVisible({ status: false })}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody alignItems={"center"} justifyContent={"center"}>
            <QRCode size={256} value={`upi://pay?cu=INR&pa=${qrVisible.upi}`} />
            <br />
            <Text textAlign={"center"}>Scan with any UPI app</Text>
            <Image
              w={"80%"}
              alignSelf={"center"}
              mx={"auto"}
              src={"https://mytechtrips.com/wp-content/uploads/2023/01/upi.png"}
              objectFit={"contain"}
            />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      {/* Tree Modal */}
      <TreeModal
        status={showTreeModal}
        onClose={() => setShowTreeModal(false)}
        groupMembers={groupMembers}
      />

      <Drawer
        isOpen={permissionsDrawer.status}
        onClose={() =>
          setPermissionsDrawer({ ...permissionsDrawer, status: false })
        }
        placement="right"
        size={"md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            Assign Permissions to {permissionsDrawer.name}
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <CheckboxGroup
              onChange={(values) => setSelectedUserPermissions(values)}
              defaultValue={selectedUserPermissions}
            >
              <FormLabel>Users Related Permissions</FormLabel>
              <Checkbox value={"user-view"}>View</Checkbox> <br />
              <Checkbox value={"user-edit"}>Edit</Checkbox> <br />
              <br />
              <FormLabel>Campaigns Related Permissions</FormLabel>
              <Checkbox value={"campaign-view"}>View</Checkbox> <br />
              <Checkbox value={"campaign-edit"}>Edit</Checkbox> <br />
              <Checkbox value={"campaign-delete"}>Delete</Checkbox> <br />
              <br />
              <FormLabel>Donations Related Permissions</FormLabel>
              <Checkbox value={"donation-view"}>View</Checkbox> <br />
              <Checkbox value={"donation-edit"}>Update</Checkbox> <br />
              <br />
              <FormLabel>Plans Related Permissions</FormLabel>
              <Checkbox value={"plan-create"}>View</Checkbox> <br />
              <Checkbox value={"plan-view"}>View</Checkbox> <br />
              <Checkbox value={"plan-edit"}>Update</Checkbox> <br />
            </CheckboxGroup>
          </DrawerBody>
          <DrawerFooter gap={4} justifyContent={"flex-end"}>
            <Button
              onClick={() =>
                setPermissionsDrawer({ ...permissionsDrawer, status: false })
              }
            >
              Close
            </Button>
            <Button colorScheme="yellow" onClick={handlePermissions}>
              Save Changes
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Users;
