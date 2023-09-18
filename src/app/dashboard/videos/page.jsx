"use client";
import React, { useState, useEffect } from "react";
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { BsDownload, BsPlus } from "react-icons/bs";
import BackendAxios from "@/utils/axios";
import { useFormik } from "formik";

const Users = () => {
  const arr = [1, 1, 1, 1, 1, 1, 2, 0];
  const Toast = useToast({ position: "top-right" });
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [videoType, setVideoType] = useState("bunny");
  const [videos, setVideos] = useState([]);

  const Formik = useFormik({
    initialValues: {
      type: videoType,
      title: "",
      video_id: "",
      link: "",
      points: "",
      isActive: false,
    },
    onSubmit: (values) => {
      BackendAxios.post("/api/video", {
        ...values,
        link:
          videoType == "youtube" &&
          `https://www.youtube.com/embed/${values.video_id}`,
      })
        .then(() => {
          fetchVideos();
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

  function fetchVideos() {
    BackendAxios.get("/api/video")
      .then((res) => {
        setVideos(res.data);
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
    fetchVideos();
  }, []);

  function deleteVideo(id){
    BackendAxios.delete(`/api/video/${id}`).then(res => {
      Toast({
        status: 'success',
        description:'Video Deleted Successfully'
      })
      fetchVideos()
    }).catch(err => {
      Toast({
        status: "error",
        description:
          err?.response?.data?.message || err?.response?.data || err?.message,
      });
    })
  }

  return (
    <>
      <HStack justifyContent={["space-between"]} py={8}>
        <Text className="serif" fontSize={"2xl"} textTransform={"capitalize"}>
          Videos
        </Text>
        <HStack alignItems={"flex-end"}>
          <Input placeholder={"Search Videos"} />
          <Button colorScheme={"yellow"}>Search</Button>
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
            <TableCaption>Videos on Virolife</TableCaption>
            <Thead bgColor={"yellow.400"}>
              <Tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>Points</Th>
                <Th>Link</Th>
                <Th>Type</Th>
                {/* <Th>Views</Th> */}
                <Th>Timestamp</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {videos.map((item, key) => (
                <Tr fontSize={"xs"} key={key}>
                  <Td>{key + 1}</Td>
                  <Td>{item?.title}</Td>
                  <Td>{item?.points}</Td>
                  <Td>
                    <Link href={item?.link} target={"_blank"}>
                      Click to View
                    </Link>
                  </Td>
                  <Td>{key % 3 == 0 ? "Bunny" : "Link"}</Td>
                  {/* <Td>{item?.points}</Td> */}
                  <Td>{new Date(item?.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <HStack gap={4}>
                      <Switch
                        defaultChecked={item?.is_active}
                        colorScheme="yellow"
                      />
                      <Button size={'sm'} colorScheme="red" onClick={()=>deleteVideo(item?.id)}>Delete</Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>

      <Button
        rounded={"full"}
        boxSize={12}
        display={"grid"}
        placeContent={"center"}
        colorScheme={"twitter"}
        pos={"fixed"}
        bottom={16}
        right={16}
        onClick={onOpen}
      >
        <BsPlus fontSize={28} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Video</ModalHeader>
          <ModalBody>
            <Text fontWeight={"500"} pb={4}>
              Video Type
            </Text>
            <HStack>
              <Button
                colorScheme="twitter"
                variant={videoType == "bunny" ? "solid" : "outline"}
                onClick={() => setVideoType("bunny")}
              >
                Bunny ID
              </Button>
              <Button
                colorScheme="twitter"
                variant={videoType == "youtube" ? "solid" : "outline"}
                onClick={() => setVideoType("youtube")}
              >
                YouTube ID
              </Button>
            </HStack>
            <br />

            <FormControl pb={4}>
              <FormLabel>Video ID</FormLabel>
              <Input name="video_id" onChange={Formik.handleChange} />
            </FormControl>

            <FormControl pb={4}>
              <FormLabel>Title</FormLabel>
              <Input name="title" onChange={Formik.handleChange} />
            </FormControl>

            <FormControl pb={4}>
              <FormLabel>Points</FormLabel>
              <Input
                type={"number"}
                name="points"
                onChange={Formik.handleChange}
              />
            </FormControl>

            <FormControl pb={4}>
              <HStack w={"full"} justifyContent={"space-between"}>
                <FormLabel>Status</FormLabel>
                <Switch
                  onChange={(e) =>
                    Formik.setFieldValue("isActive", e.target.checked)
                  }
                />
              </HStack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button colorScheme="twitter" onClick={Formik.handleSubmit}>
                Save Video
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Users;
