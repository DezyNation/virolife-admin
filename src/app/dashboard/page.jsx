"use client";
import React, { useEffect, useState } from "react";
import {
  Text,
  Stack,
  Box,
  Image,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  BsArrowRight,
  BsCashCoin,
  BsCurrencyRupee,
  BsMegaphoneFill,
  BsPerson,
  BsPersonFill,
  BsYoutube,
} from "react-icons/bs";
import Link from "next/link";
import BackendAxios from "@/utils/axios";

const DashboardHome = () => {
  const [selectedImg, setSelectedImg] = useState(
    "https://t3.ftcdn.net/jpg/04/19/34/24/360_F_419342418_pBHSf17ZBQn77E7z3OWcXrWfCuxZkc3Q.jpg"
  );

  const [overviewData, setOverviewData] = useState([]);

  useEffect(() => {
    BackendAxios.get("/api/admin/overview")
      .then((res) => {
        setOverviewData(res.data);
      })
      .catch((err) => {
        if(err?.response?.status == 401){
          localStorage.clear()
          Cookies.remove("jwt")
          setTimeout(() => {
            window.location.replace("/auth")
          }, 500);
        }
        console.log(err);
      });
  }, []);

  return (
    <>
      <Text
        className="serif"
        fontSize={"xl"}
        py={4}
        textTransform={"capitalize"}
      >
        Welcome Admin
      </Text>
      <Stack
        w={"full"}
        direction={["column", "row"]}
        gap={[8, 16]}
        justifyContent={"space-between"}
      >
        <StatsCard
          icon={<BsPersonFill size={28} />}
          title={"Total Users"}
          quantity={overviewData[0]?.count}
        />
        <StatsCard
          icon={<BsMegaphoneFill size={28} />}
          title={"active campaigns"}
          quantity={overviewData[1]?.count}
        />
        <StatsCard
          icon={<BsCurrencyRupee size={28} />}
          title={"total collected"}
        />
        <StatsCard icon={<BsCashCoin size={28} />} title={"amount settled"} />
      </Stack>
      {/* <Box pt={16}>
        <Stack
          direction={["column", "row"]}
          gap={8}
          justifyContent={"space-between"}
        >
          <Box flex={["unset", 4]}>
            <Text pb={8}>Most Recent Campaign</Text>
            {overviewData[1]?.campaigns?.length ? (
              <Box
                pos={"relative"}
                boxShadow={"md"}
                rounded={8}
                overflow={"hidden"}
                bgImage={
                  `https://api.virolife.in/${overviewData[1]?.campaigns[0]?.file_path}` ||
                  "https://idea.batumi.ge/files/default.jpg"
                }
                bgSize={"cover"}
                bgRepeat={"no-repeat"}
                h={"sm"}
                cursor={"pointer"}
              >
                <Box
                  position={"absolute"}
                  w={"full"}
                  h={"sm"}
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  p={4}
                  bgImage={
                    "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.3))"
                  }
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"flex-start"}
                  justifyContent={"flex-end"}
                >
                  <Text pos={"absolute"} top={4} right={4} color={"#FFF"}>
                    {new Date().toLocaleString()}
                  </Text>
                  <Text className="serif" fontSize={"3xl"} color={"#FFF"}>
                    {overviewData[1]?.campaigns[0]?.title}
                  </Text>
                  <Text fontSize={"xs"} color={"#FFF"}>
                    {overviewData[1]?.campaigns[0]?.description}
                  </Text>
                </Box>
              </Box>
            ) : null}
            <Link href={"/dashboard/campaigns"}>
              <Button mt={8} colorScheme="yellow" rightIcon={<BsArrowRight />}>
                View All Campaigns
              </Button>
            </Link>
          </Box>
          <Box flex={["unset", 2]}>
            <Text pb={8}>New Members</Text>
            <VStack gap={4} w={"full"} p={4} boxShadow={"md"} rounded={8}>
              {overviewData[0]?.users?.map((user, key) => (
                <Box w={"full"} p={2} borderBottom={"1px"} borderColor={"#DDD"}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                  >
                    <Box>
                      <Text className="serif">{user?.name}</Text>
                      <Text fontSize={"xs"} color={"#AAA"}>
                        {new Date(user?.created_at).toLocaleString()}
                      </Text>
                    </Box>
                    <Box>
                      
                      {user?.wallet}
                    
                    <Text fontSize={'xs'} textAlign={'right'} >Points</Text>
                    </Box>
                  </HStack>
                </Box>
              ))}
              <Button pt={4} w={"full"} variant={"link"} colorScheme="yellow">
                View All Users
              </Button>
            </VStack>
          </Box>
        </Stack>
      </Box> */}
    </>
  );
};

export default DashboardHome;
