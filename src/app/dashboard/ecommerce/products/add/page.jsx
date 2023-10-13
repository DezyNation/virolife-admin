"use client";
import React, { useCallback, useState } from "react";
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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { BsXCircleFill } from "react-icons/bs";
import { FormAxios } from "@/utils/axios";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(async () => {
  const { default: RQ } = await import("react-quill");
  return ({ ...props }) => <RQ {...props} />;
});

const Page = () => {
  const Toast = useToast({ position: "top-right" });
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
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
      title: "",
      files: null,
      description: "",
      full_description: "",
      category_id: "",
      price: "",
      health_points_status: true,
      ad_points_status: true,
      atp_points_status: true,
      gift_card_status: true,
    },
    onSubmit: (values) => {
      setLoading(true);
      FormAxios.post("/api/campaign", {
        ...values,
      })
        .then((res) => {
          setLoading(false);
          Toast({
            status: "success",
            description: "Your campaign was sent for review!",
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

  return (
    <>
      <Text pb={4} fontSize={"2xl"} fontWeight={"semibold"} className="serif">
        Add New Product
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
            onChange={Formik.handleChange}
          >
            <option value="1">Medical</option>
            <option value="2">Education</option>
            <option value="3">New Startup</option>
            <option value="4">Sports Help</option>
          </Select>
        </FormControl>
        <FormControl py={4} w={["full", "xs"]}>
          <FormLabel>Price</FormLabel>
          <InputGroup>
            <InputLeftElement children={"₹"} />
            <Input
              type="number"
              name={"price"}
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
          name="title"
          placeholder="e.g: Set of 6 Notebooks"
          onChange={Formik.handleChange}
        />
      </FormControl>
      <Box p={4}>
        <Text pb={4} fontWeight={"semibold"}>
          Upload Images
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
        <HStack py={4}>
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
      <FormControl py={4}>
        <FormLabel>Short Description (15-20 words)</FormLabel>
        <Textarea
          w={"full"}
          name="description"
          onChange={Formik.handleChange}
          placeholder="Brief description about this product"
        ></Textarea>
      </FormControl>
      <FormControl py={4}>
        <FormLabel>Full description</FormLabel>
        <QuillNoSSRWrapper
          theme="snow"
          value={Formik.values.full_description}
          onChange={(value) => Formik.setFieldValue("full_description", value)}
          style={{ height: "400px" }}
        />
      </FormControl>
      <br />
      <br />
      <br />
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
        <HStack gap={4} wrap={"wrap"}>
          <Button
            colorScheme="yellow"
            variant={Formik.values.health_points_status ? "solid" : "outline"}
            onClick={() =>
              Formik.setFieldValue(
                "health_points_status",
                !Formik.values.health_points_status
              )
            }
          >
            Health Points
          </Button>
          <Button
            colorScheme="yellow"
            variant={Formik.values.ad_points_status ? "solid" : "outline"}
            onClick={() =>
              Formik.setFieldValue(
                "ad_points_status",
                !Formik.values.ad_points_status
              )
            }
          >
            Ad Points
          </Button>
          <Button
            colorScheme="yellow"
            variant={Formik.values.atp_points_status ? "solid" : "outline"}
            onClick={() =>
              Formik.setFieldValue(
                "atp_points_status",
                !Formik.values.atp_points_status
              )
            }
          >
            All Team Points
          </Button>
          <Button
            colorScheme="yellow"
            variant={Formik.values.gift_card_status ? "solid" : "outline"}
            onClick={() =>
              Formik.setFieldValue(
                "gift_card_status",
                !Formik.values.gift_card_status
              )
            }
          >
            Gift Card
          </Button>
        </HStack>
      </VStack>
      <HStack justifyContent={"flex-end"} py={4}>
        <Button
          colorScheme="yellow"
          isLoading={loading}
          onClick={Formik.handleSubmit}
          variant={"outline"}
        >
          Save as Draft
        </Button>
        <Button
          colorScheme="yellow"
          isLoading={loading}
          onClick={Formik.handleSubmit}
        >
          Publish
        </Button>
      </HStack>
    </>
  );
};

export default Page;