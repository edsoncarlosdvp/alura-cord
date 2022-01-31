import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { React, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'
import appConfig from '../../config.json';

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU5NjUwMywiZXhwIjoxOTU5MTcyNTAzfQ.ZtSwLF0afEUOAwqsTSe4n9OAE3DtU7OvTj1ikj1Mg88'
const URL = 'https://nskysgxlxcjwkzsuffmm.supabase.co'
const supabaseClient = createClient(URL, ANON_KEY)

export default function ChatPage() {
    const [message, setMessage] = useState('')
    const [listMessages, setListMessages] = useState([])

    useEffect(() => {
        supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', { ascending: false })
        .then(({data}) => {
            console.log('Dados da consulta: ', data)
            setListMessages(data)
        })
    }, [])

    function handleText(e){
        const value = e.target.value;
        setMessage(value);
    }

    function sendMessage(e) {
        if (e.key === "Enter") {
            e.preventDefault()
            handleMessage(message)
        }
    }

    function handleMessage(newMessage) {
        const message = {
            // id: listMessages.length + 1,
            from: 'vanessametonini',
            text: newMessage
        }
        supabaseClient
        .from('mensagens')
        .insert([
            message
        ])
        .then(({data}) => {
            setListMessages([
                data[0],
                ...listMessages
            ])
        })
        setMessage('')
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    
                    {/* {listMenssages.map((newMenssage) => {
                        return (
                            <li key={newMensage.id}>
                                {newMenssage.from}: {newMenssage.text}
                            </li>
                        )
                    })} */}
                    <MessageList messagesSending={listMessages} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={handleText}
                            onKeyPress={sendMessage}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props)
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
            >
            {props.messagesSending.map((messageSendings) => {
                return (
                    <Text
                        key={messageSendings.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${messageSendings.from}.png`}
                            />
                            <Text tag="strong">
                                {messageSendings.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {messageSendings.text}
                    </Text>
                )
            })}
        </Box>
    )
}