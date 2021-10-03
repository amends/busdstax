import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import useEagerConnect from "../hooks/useEagerConnect";
import {
  Button,
  SimpleGrid,
  Box,
  Text,
  Heading,
  Img,
  Center,
  HStack,
  VStack,
  Badge,
  Input,
  Link,
  Spinner,
} from "@chakra-ui/react"
import { useState } from "react";
import useTokenBalance from "../hooks/useTokenBalance";
import useMinter from "../hooks/useMinter"
import useTokenContract from "../hooks/useTokenContract";
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ethers } from "ethers";
import useMyMiners from "../hooks/useMyMiners";
import useFPS from "../hooks/useFPS";
import useBAL from "../hooks/useAvailBalance"
import useCountdown from "../hooks/useCountdown";
import useCakeApproval from "../hooks/useCakeApproval";
import useCakeBaking from "../hooks/useCakeBaking";
import { FaTwitter, FaTelegram } from "react-icons/fa"
import { parseBalance } from "../util";
var isLoading = false;
function Home() {
  
  const { account, library } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const [CAKE, setCAKE] = useState('');
  const [miners, setMiners] = useState('');
  const [printers, setPrinters] = useState('0')
  const balCAKE = useTokenBalance(account, "0xe9e7cea3dedca5984780bafc599bd69add087d56")
  const cakeContract = useTokenContract("0xe9e7cea3dedca5984780bafc599bd69add087d56")
  const miner = useMinter()
  const isConnected = typeof account === "string" && !!library;
  const router = useRouter()
  const myMiners = useMyMiners(account)
  const FPS = useFPS(account)
  const preFeeBAL = useBAL(account)
  const date = useCountdown(account)
  const isCakeApproved = useCakeApproval("0x884aFe9CbB26C27622bccD5D469607515B721b4E", account);
  const cakeBal = useCakeBaking();
  const BAL = (Number(preFeeBAL.data) * 0.95).toFixed(2)
  const TVL = (Number(cakeBal.data))

  const asyncSetMiners = async (event) => {
    setMiners(event)
  }
  const asyncSetPrinters = async (value) => {
    setPrinters(value)
  }

  async function onMinerFieldChange(event: any){
    await asyncSetMiners(event)
    await getEstimatedMiners(event).then(result =>
      asyncSetPrinters(result))
  }

    const getEstimatedMiners = async(event) => {
    if(Number(event) > 0){
    const estimatedBuy = await miner.calculateBusdBuySimple(ethers.utils.parseEther(event));
    const estimatedMiners = (Number(estimatedBuy) * 2.3).toFixed(0)
    return parseBalance(estimatedMiners,7,0)
    }
    return "0";
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.href;
      const split = hostname.split("=")
      const ref = split[1]   }
   
  })


  async function approveCAKE(amount: any) {
    isLoading = true;
    const approve = await cakeContract.approve("0x884aFe9CbB26C27622bccD5D469607515B721b4E", amount)
  }
  async function investCAKE(amount: any){
    const hostname = window.location.href;
      let ref
      const split = hostname.split("=")
      var data = split[1]
      if(data && data.length > 10){
         ref = data
      } else {
         ref = account
      }
    const invest = await miner.buyBusd(ref, amount)
  }
  async function compoundCAKE(){
    const hostname = window.location.href;
      let ref
      const split = hostname.split("=")
      var data = split[1]
      if(data && data.length > 10){
         ref = data
      } else {
         ref = account
      }
    const compound = await miner.compoundBusd(ref)
  }
  async function sellCAKE(){
    const pop = await miner.sellBusd()
  }

  return (
    <Box bg="yellow.500" minW="100vw" minH="100vh">
    <>
      <Head>
        <title>BUSDStax BUSD Minting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
          <Center pt={5}>
          <VStack>
          <Button colorScheme="gray"><Account triedToEagerConnect={triedToEagerConnect} /></Button>
          <Heading px={10} size="md" as="a" href="https://cakestax.money" color="white">Looking to bake CAKE? Click here for CakeStax.</Heading>
          <Heading px={10} size="md" as="a" href="https://ziggystax.money" color="white">Looking to mine POTS? Click here for ZiggyStax.</Heading>
          <Heading px={10} size="md" as="a" href="https://yetistax.money" color="white">Looking to mint xBLZD? Click here for YetiStax.</Heading>
          </VStack>
          </Center>
          <SimpleGrid column={5} spacing={5} justifyItems="center">
          <Box borderRadius="30px" mt="2em" boxShadow="lg" bg="white" alignItems="center" width={{base: "90vw", md: "40vw"}}>
          <Center>
            <HStack>
            <Img maxW="100px" maxH="100px" p="1em" src="/busd.svg" />
            <Heading fontSize={{base: "xl", md: "3xl"}} color="gray.500" p={{base: 0, md: 5}}>BUSDStax BUSD Minter</Heading>
            <Img maxW="100px" maxH="100px" p="1em" src="/busd.svg" />
            </HStack>
          </Center>
          <Center>
            <VStack>
              {isConnected ?<>
            <Text color="gray.500" fontSize={{base: "md", md: "xl"}} px={3} py={1}>{cakeBal.data} Total BUSD being printed.</Text>
            <Text color="gray.500" fontSize={{base: "md", md: "xl"}} px={3} py={2}>${TVL} Total Value Locked</Text></> :
             <><Text color="gray.500" p={1}>Please Connect To MetaMask.</Text></>
              }
            </VStack>
          </Center>
            <Center>
            <VStack>
            <HStack pb={5}>
            <Badge ml="1" fontSize="1em" colorScheme="green">3% DAILY</Badge>
            <Badge ml="1" fontSize="1em" colorScheme="green">1,095% APR</Badge>
            </HStack>
            <HStack pb={5}>
            <Button as="a" href="https://twitter.com/cake_stax" colorScheme="twitter" leftIcon={<FaTwitter />}>Twitter</Button>
            <Button as="a" href="https://t.me/CakeStax" colorScheme="telegram" leftIcon={<FaTelegram />}>Telegram</Button>
            </HStack>
            </VStack>
            </Center>
          </Box>
        
          <Center borderRadius="30px" boxShadow="lg" bg="white" alignItems="center" width={{base: "90vw", md: "40vw"}}>
          <VStack p={5}>
              <Text color="gray.500" p={1}>1. Enter BUSD Amount Below and Approve Spend</Text>
              <Input onChange={event => setCAKE(event.target.value)} value={CAKE} placeholder="Amount of BUSD" />
              <HStack>
              {isConnected ? <>
              <Button variant="link" onClick={(e) => setCAKE(balCAKE.data)}>{balCAKE.data}</Button>
              <Text color="gray.500" p={1}>available BUSD</Text></> :
              <Spinner mb={3} color="blue.500" />
              }
              </HStack>
              {!isCakeApproved.data ? 
              <Button isLoading={isLoading} onClick={() => approveCAKE(ethers.utils.parseEther(CAKE))}colorScheme="yellow">Approve BUSD Spend</Button> :
              <Button isLoading={false} onClick={() => approveCAKE(ethers.utils.parseEther(CAKE))}colorScheme="yellow">Approve Additional BUSD Spend</Button>
              }
            </VStack>
          </Center>
          <Center borderRadius="30px" boxShadow="lg" bg="white" alignItems="center" width={{base: "90vw", md: "40vw"}}>
          <VStack p={5}>
              <Text color="gray.500" p={1}>2. Exchange BUSD To Buy Printers. Printers mint you BUSD!</Text>
              <Input onChange={e => onMinerFieldChange(e.target.value)} value={miners} placeholder="Amount of BUSD" />
              <HStack>
              {isConnected ? <>
              <Button variant="link" onClick={(e) => onMinerFieldChange(balCAKE.data)}>{balCAKE.data}</Button>
              <Text color="gray.500" p={1}>available BUSD</Text></> :
              <Spinner mb={3} color="blue.500" />
              }
              </HStack>
              <Button onClick={() => investCAKE(ethers.utils.parseEther(miners))} colorScheme="yellow">Buy {printers} Printers</Button>
            </VStack>
          </Center>
          <Center borderRadius="30px" boxShadow="lg" bg="white" alignItems="center" width={{base: "90vw", md: "40vw"}}>
          <VStack p={5}>
              {isConnected ? <>
              <Text color="gray.500" fontSize="2xl" fontWeight="semibold">{myMiners.data} Printers Purchased</Text>
              <Text color="gray.500" fontSize="2xl" fontWeight="semibold">{BAL} Printed BUSD</Text>
              <Text color="gray.500" fontSize={{base:"lgs", md:"2xl"}} fontWeight="semibold">Your BUSD will be finished printing on:<br/> {date.data}</Text></> :
              <Spinner mb={3} color="blue.500" />
              }
            <SimpleGrid columns={{base:1, md:2}} spacing={3}>
            <Button onClick={() => compoundCAKE()} colorScheme="yellow">Buy More Printers</Button>
            <Button onClick={() => sellCAKE()} colorScheme="yellow">Pocket Printed BUSD</Button>
            </SimpleGrid>
            </VStack>
    
          </Center>
          <Center mb={5} borderRadius="30px" boxShadow="lg" bg="white" alignItems="center" width={{base: "90vw", md: "40vw"}}>
          <VStack p={5}>
              <Text color="gray.500" fontSize="md" fontWeight="semibold">Use your referral link to get free printers!</Text>
              {isConnected ? <>
              <Link href={`https://busdstax.money?ref=${account}`}><Text color="gray.500" fontSize="10px" fontWeight="semibold">https://busdstax.money?ref={account}</Text></Link></> :
              <Spinner mb={3} color="blue.500" />
              }
            </VStack>
    
          </Center>
          </SimpleGrid>
          
       </>
       </Box>
  );
}

export default Home;
