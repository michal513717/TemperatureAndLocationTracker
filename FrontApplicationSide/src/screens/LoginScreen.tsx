import React, { useCallback, useState } from 'react'
import {
    Flex,
    Heading,
    Input,
    Button,
    FormControl,
    FormLabel,
    Switch,
    useColorMode,
    useColorModeValue,
    useToast,
    Link as ChakraLink
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import axios from "axios";
import { useAuthStore } from '@/store/authStore';
import { setAccessToken } from '@/store/localStorage/localStorage';
import { APPLICATION_CONFIG } from '@/configs';
import { MESSAGES } from '@/configs/messages';

function LoginScreen() {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setIsAuthenticated } = useAuthStore();
    const { toggleColorMode } = useColorMode();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();
    const formBackground = useColorModeValue('gray.100', 'gray.700');

    const handleLogin =  useCallback(async() => {

        if(userName === "" || password === ""){
            toast({
                title: MESSAGES.NO_DATA_ENTERED,
                description: MESSAGES.NO_DATA_ENTERED_2,
                status: "error",
                duration: 3000,
                isClosable: true,
            });

            return;
        }

        try {
            setIsLoading(true);

            const req = await axios.post(APPLICATION_CONFIG.SERVER_ADDRESS + "/auth/login", { userName, password });

            if(req.status === 200){
    
                setIsAuthenticated(true);
                setAccessToken(req.data.result.accessToken);
            }
    
        } catch (error) {
        
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    },[userName, password]);

    return (
        <Flex h="100vh" alignItems="center" justifyContent="center">
            <Flex
                flexDirection="column"
                bg={formBackground}
                p={12}
                borderRadius={8}
                boxShadow="lg"
            >
                <Heading mb={6}>Log In</Heading>
                <Input
                    placeholder="johndoe@gmail.com"
                    variant="filled"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    mb={3}
                />
                <Input
                    placeholder="**********"
                    type="password"
                    variant="filled"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    mb={6}
                />
                <Button colorScheme="teal" mb={8} onClick={handleLogin} isLoading={isLoading}>
                    Log In
                </Button>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dark_mode" mb="4">
                        Don't have account? <ChakraLink as={ReactRouterLink} to={'/register'}> Register now! </ChakraLink>
                    </FormLabel>
                </FormControl>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dark_mode" mb="0">
                        Enable Dark Mode?
                    </FormLabel>
                    <Switch
                        id="dark_mode"
                        colorScheme="teal"
                        size="lg"
                        onChange={toggleColorMode}
                    />
                </FormControl>
            </Flex>
        </Flex>
    )
}

export default LoginScreen;