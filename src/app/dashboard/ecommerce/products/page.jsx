"use client";
import ProductsList from "@/components/dashboard/ecommerce/ProductsList";
import { Button, HStack, Input, Text } from "@chakra-ui/react";
import React from "react";
import { BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";

const page = () => {
  const { push } = useRouter();
  return (
    <>
      <Text fontSize={"lg"} fontWeight={"semibold"}>
        Manage Products
      </Text>
      <br />
      <ProductsList />

      <Button
        rounded={"full"}
        colorScheme="twitter"
        leftIcon={<BsPlus />}
        pos={"fixed"}
        bottom={4}
        right={4}
        onClick={()=>push(`/dashboard/ecommerce/products/add`)}
      >
        Add New
      </Button>
    </>
  );
};

export default page;
