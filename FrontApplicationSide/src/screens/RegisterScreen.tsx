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
import { redirect, useNavigate } from "react-router-dom";
import { Link as ReactRouterLink } from 'react-router-dom'
import axios from "axios";
import { APPLICATION_CONFIG } from '@/configs';
import { MESSAGES } from '@/configs/messages';
import { ROUTES } from '@/configs/routes';

function LoginScreen() {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const { toggleColorMode } = useColorMode();
    const toast = useToast();
    const formBackground = useColorModeValue('gray.100', 'gray.700');

    const handleLogin =  useCallback(async() => {

        let message: string = "";
        let title: string = "";
        let toastType: ToastType = "error";

        if(password !== repeatPassword){
            title = MESSAGES.INVALID_DATA;
            message = MESSAGES.INVALID_DATA_2;
            return
        }

        if(userName === "" || password === ""){
            title = MESSAGES.INVALID_DATA_3;
            message = MESSAGES.INVALID_DATA_4;
            return;
        }

        try {
            setIsLoading(true);

            const req = await axios.post(APPLICATION_CONFIG.SERVER_ADDRESS + ROUTES.REGISTER, { userName, password });

            console.log(req.status);
    
            if(req.status === 200){
                title = MESSAGES.SUCCESS_2;
                message = MESSAGES.SUCCESS;
                toastType = "success";

                navigate("/");
            }

        } catch (error: any) {
            
            //@ts-ignore
            const isServerUser = Object.keys().includes(error?.response?.data?.code);

            title = isServerUser ? MESSAGES.SERVER_OFFLINE : MESSAGES.TRY_AGAIN;
            //@ts-ignore
            message = MESSAGES[error?.response?.data?.code]
        } finally {
            setIsLoading(false);

            toast({
                title: title,
                description: message,
                status: toastType,
                duration: 3000,
                isClosable: true,
            });
        }
    },[userName, password, repeatPassword]);

    return (
        <Flex h="100vh" alignItems="center" justifyContent="center">
            <Flex
                flexDirection="column"
                bg={formBackground}
                p={12}
                borderRadius={8}
                boxShadow="lg"
            >
                <Heading mb={6}>Register now!</Heading>
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
                    mb={3}
                />
                <Input
                    placeholder="**********"
                    type="password"
                    variant="filled"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    mb={6}
                />
                <Button colorScheme="teal" mb={8} onClick={handleLogin} isLoading={isLoading}>
                    Log In
                </Button>
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dark_mode" mb="4">
                        Have a account? <ChakraLink as={ReactRouterLink} to={'/'}> Login now! </ChakraLink>
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

type ToastType = "success" | "error";