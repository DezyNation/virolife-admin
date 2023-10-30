"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Text,
  Box,
  Image,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Textarea,
  HStack,
  Icon,
  useToast,
  Select,
  Stack,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { BsXCircleFill } from "react-icons/bs";
import BackendAxios, { FormAxios } from "@/utils/axios";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { FaTrashAlt } from "react-icons/fa";

const QuillNoSSRWrapper = dynamic(async () => {
  const { default: RQ } = await import("react-quill");
  return ({ ...props }) => <RQ {...props} />;
});

const Page = ({ params }) => {
  const Toast = useToast({ position: "top-right" });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([])
  const [campaign, setCampaign] = useState({});
  const [campaignImages, setCampaignImages] = useState(null);
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [imageToDelete, setImageToDelete] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({
    type: "myself",
    name: "",
    address: "",
    contact: "",
  });

  const { id } = params;

  useEffect(() => {
    fetchCampaignInfo();
  }, []);

  function fetchCampaignInfo() {
    BackendAxios.get(`/api/product/${id}`)
      .then((res) => {
        setCampaign(res.data);
        if (res?.data?.images) {
          setCampaignImages(JSON.parse(res?.data?.images));
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

  const onDrop = useCallback(async (acceptedFiles) => {
    Formik.setFieldValue("files", acceptedFiles);
    const newImages = acceptedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages)
      .then((imagePreviews) =>
        setSelectedImages((prevImages) => [...prevImages, ...imagePreviews])
      )
      .catch((error) => console.error("Error reading file:", error));
  }, []);

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    Formik.setFieldValue(
      "files",
      Formik.values.files?.filter((_, i) => i !== index)
    );
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const Formik = useFormik({
    initialValues: {
      name: "",
      files: null,
      description: "",
      longDescription: "",
      categoryId: "",
      price: "",
      strikedPrice: "",
      deliveryCharges: "",
      minimumPayableAmount: "",
      healthPoint: "",
      adPoint: "",
      atpPoint: "",
      giftCardStatus: true,
      status: true,
    },
    onSubmit: (values) => {
      setLoading(true);
      BackendAxios.put(`/api/product/${id}`, {
        ...values,
        giftCardStatus: values?.giftCardStatus ? 1 : 0,
        status: values?.status ? 1 : 0,
      })
        .then((res) => {
          setLoading(false);
          Toast({
            status: "success",
            description: "Product was updated successfully!",
          });
        })
        .catch((err) => {
          setLoading(false);
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
    Formik.setFieldValue("price", campaign?.price);
    Formik.setFieldValue("strikedPrice", campaign?.striked_price);
    Formik.setFieldValue("deliveryCharges", campaign?.delivery_charges);
    Formik.setFieldValue(
      "minimumPayableAmount",
      campaign?.minimum_payable_amount
    );
    Formik.setFieldValue("name", campaign?.name);
    Formik.setFieldValue("description", campaign?.description);
    Formik.setFieldValue("longDescription", campaign?.longDescription);
    Formik.setFieldValue("categoryId", campaign?.category?.id);
    Formik.setFieldValue("healthPoint", campaign?.health_point);
    Formik.setFieldValue("adPoint", campaign?.ad_point);
    Formik.setFieldValue("atpPoint", campaign?.atp_point);
    Formik.setFieldValue(
      "giftCardStatus",
      campaign?.gift_card_status === 1 ? true : false
    );
    Formik.setFieldValue("status", campaign?.status === 1 ? true : false);
  }, [campaign]);

  function removeFile(img) {
    const imgsArr = campaignImages;
    const index = imgsArr?.indexOf(img);
    if (!index) return;
    const newArr = imgsArr?.splice(index, 1);
    BackendAxios.post(`/api/product/update-attachment/${id}`, {
      filePath: JSON.stringify(newArr),
    })
      .then((res) => {
        Toast({
          status: "success",
          description: "Images updated successfully!",
        });
        setConfirmationModal(false);
        window.location.href("/dashboard/ecommerce/products")
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
    BackendAxios.get("/api/category")
      .then((res) => {
        setCategories(
          res.data?.filter((category) => category?.type == "ecommerce")
        );
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error fetching categories",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  }, []);

  return (
    <>
      <Text pb={4} fontSize={"2xl"} className="serif">
        Update Product Details
      </Text>
      <br />
      <Stack
        direction={["column", "row"]}
        justifyContent={"space-between"}
        gap={8}
        py={6}
      >
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Select Category</FormLabel>
          <Select
            name="category_id"
            placeholder="Select Here"
            onChange={(e) => Formik.setFieldValue("categoryId", e.target.value)}
            value={Formik.values.categoryId}
          >
            {categories.map((category) => (
              <option value={category?.id}>{category?.name}</option>
              ))
            }
          </Select>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Min. Payable Amount</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"minimumPayableAmount"}
              onChange={Formik.handleChange}
              value={Formik.values.minimumPayableAmount}
            />
          </InputGroup>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Price</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"price"}
              onChange={Formik.handleChange}
              value={Formik.values.price}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Stack
        direction={["column", "row"]}
        justifyContent={"space-between"}
        gap={8}
        py={6}
      >
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Cancelled Price</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"strikedPrice"}
              value={Formik.values.strikedPrice}
              onChange={Formik.handleChange}
            />
          </InputGroup>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Shipping Price</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"deliveryCharges"}
              value={Formik.values.deliveryCharges}
              onChange={Formik.handleChange}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <FormControl py={4}>
        <FormLabel>Product Name</FormLabel>
        <Input
          w={"full"}
          variant={"flushed"}
          fontSize={["xl", "2xl", "3xl"]}
          className="serif"
          p={2}
          name="name"
          placeholder="e.g: Srimad Bhagvatam Complete Set"
          onChange={Formik.handleChange}
          value={Formik.values.name}
        />
      </FormControl>
      <HStack
        w={"full"}
        flexWrap={"wrap"}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
      >
        <Box p={4}>
          <Text fontWeight={"semibold"}>Upload Image</Text>
          <Text pb={4} color={"darkslategray"}>
            Uploading new images will replace the existing ones.
            <br />
            Kindly download the existing images before uploading any new images.
          </Text>
          <VStack
            {...getRootProps()}
            w={["full", "lg"]}
            h={"xs"}
            rounded={16}
            border={"1px"}
            borderStyle={"dashed"}
            bg={"#FAFAFA"}
            cursor={"pointer"}
            justifyContent={"center"}
          >
            <Input visibility={"hidden"} {...getInputProps()} />
            {isDragActive ? (
              <Text>Drop Your Files Here...</Text>
            ) : (
              <Text>Click to Upload Or Drop Your Files Here...</Text>
            )}
          </VStack>
          <HStack py={4} overflowX={"scroll"}>
            {selectedImages.map((image, index) => (
              <Box key={index} pos={"relative"}>
                <Icon
                  as={BsXCircleFill}
                  color={"red"}
                  pos={"absolute"}
                  size={12}
                  top={0}
                  right={0}
                  onClick={() => removeImage(index)}
                />
                <Image
                  src={image}
                  w={36}
                  h={36}
                  rounded={16}
                  objectFit={"cover"}
                />
              </Box>
            ))}
          </HStack>
        </Box>
        <Box>
          <Text>Existing Images</Text>
          {campaign?.images
            ? JSON.parse(campaign?.images)?.map((img, key) => (
                <HStack
                  justifyContent={"space-between"}
                  p={4}
                  key={key}
                  rounded={4}
                  bgColor={"#FFF"}
                  boxShadow={"md"}
                >
                  <Image
                    boxSize={"24"}
                    src={process.env.NEXT_PUBLIC_BACKEND_URL + "/" + img}
                    rounded={6}
                  />
                  <Box>
                    <Button
                      rounded={"full"}
                      colorScheme="red"
                      leftIcon={<FaTrashAlt />}
                      size={"sm"}
                      onClick={() => {
                        // setConfirmationModal(true);
                        // setImageToDelete(img);
                        removeFile(img);
                      }}
                    >
                      Remove File
                    </Button>
                  </Box>
                </HStack>
              ))
            : null}
        </Box>
      </HStack>
      <FormControl py={4}>
        <FormLabel>Short Description (15-20 words)</FormLabel>
        <Textarea
          w={"full"}
          name="description"
          onChange={Formik.handleChange}
          value={Formik.values.description}
          placeholder="Brief description of your campaign"
        ></Textarea>
      </FormControl>
      <FormControl py={4}>
        <FormLabel>Your message</FormLabel>
        <QuillNoSSRWrapper
          value={Formik.values.longDescription}
          onChange={(value) => Formik.setFieldValue("longDescription", value)}
        />
      </FormControl>

      <VStack
        w={"full"}
        py={4}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
      >
        <Text fontSize={"lg"} className="serif">
          Which payment methods will be allowed?
        </Text>
        <br />
        <HStack alignItems={"flex-end"} gap={6} wrap={"wrap"}>
          <FormControl maxW={["full", "xs"]}>
            <FormLabel fontSize={"xs"}>Health Points</FormLabel>
            <Input
              type="number"
              name="healthPoint"
              value={Formik.values.healthPoint}
              onChange={Formik.handleChange}
            />
          </FormControl>

          <FormControl maxW={["full", "xs"]}>
            <FormLabel fontSize={"xs"}>Ad Points</FormLabel>
            <Input
              type="number"
              name="adPoint"
              value={Formik.values.adPoint}
              onChange={Formik.handleChange}
            />
          </FormControl>

          <FormControl maxW={["full", "xs"]}>
            <FormLabel fontSize={"xs"}>All Team Points</FormLabel>
            <Input
              type="number"
              name="atpPoint"
              value={Formik.values.atpPoint}
              onChange={Formik.handleChange}
            />
          </FormControl>

          <FormControl maxW={["full", "xs"]}>
            <FormLabel fontSize={"xs"}>Allow Discount Card</FormLabel>
            <HStack gap={6}>
              <Button
                colorScheme="yellow"
                variant={Formik.values.giftCardStatus ? "solid" : "outline"}
                onClick={() => Formik.setFieldValue("giftCardStatus", true)}
              >
                Yes
              </Button>
              <Button
                colorScheme="yellow"
                variant={!Formik.values.giftCardStatus ? "solid" : "outline"}
                onClick={() => Formik.setFieldValue("giftCardStatus", false)}
              >
                No
              </Button>
            </HStack>
          </FormControl>
        </HStack>
      </VStack>
      <HStack justifyContent={"flex-end"} py={4}>
        {/* <Button
          colorScheme="yellow"
          isLoading={loading}
          onClick={() => {
            Formik.setFieldValue("status", false);
            setLoading(true);
            setTimeout(() => {
              Formik.handleSubmit();
            }, 200);
          }}
          variant={"outline"}
        >
          Change to Draft
        </Button> */}

        <Button
          colorScheme="yellow"
          isLoading={loading}
          onClick={Formik.handleSubmit}
        >
          Save
        </Button>
      </HStack>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={confirmationModal}
        onClose={() => setConfirmationModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>Are you sure to delte this file?</ModalBody>
          <ModalFooter justifyContent={"flex-end"}>
            <Button
              variant={"ghost"}
              onClick={() => setConfirmationModal(false)}
            >
              Cancel
            </Button>
            <Button colorScheme="red" onClick={() => removeFile(imageToDelete)}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Page;
