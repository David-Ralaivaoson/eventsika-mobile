import { useAuth } from '@/context/AuthContext'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SheetScreen } from 'react-native-sheet-transitions'
const bg1 = require('../../assets/images/background/bg-1.png')

const API_URL = 'http://192.168.88.4:3000/api/auth/sign-up/email'

function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordSecure, setPasswordSecure] = useState(true)
  const {login, loading} = useAuth()

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur de connexion')
      }

      return response.json()
    },
    onSuccess: async (data) => {
      // Tu peux ici stocker le token ou rediriger
      console.log('✅ Connexion réussie', data)
      await login(data.token)
      // Exemple : stocker le token dans AsyncStorage
      // await AsyncStorage.setItem('token', data.token)

      router.push('/(tabs)') // Redirection après connexion
    },
    onError: (error: any) => {
      console.log(error)
      Alert.alert('Erreur', error.message || 'Une erreur est survenue.')
    },
  })

  
  const router = useRouter()
  return (
    <SheetScreen 
      onClose={() => router.back()}
      opacityOnGestureMove={true}
      containerRadiusSync={true}
      initialBorderRadius={0}
    >

    
    <View className='justify-end h-full'>
      {/* <ImageBackground source={bg1}> */}
        {/* <View style={styles.container} className='h-[20%] flex items-center justify-center'>
          <Text className='text-5xl font-bold text-fuchsia-100 shadow-slate-500 shadow-lg'>Eventsika</Text>
        </View> */}
        <View className='h-[80%] flex items-center justify-evenly gap-4 bg-white rounded-tl-3xl rounded-tr-3xl'>
            <Text className='font-bold text-3xl my-6'>S'inscrire</Text>
            <View className='w-[80%] flex gap-4'>
                
                <TextInput 
                  placeholder='Name' 
                  value={name}
                  onChangeText={setName}
                  autoCorrect={false}

                  className='border-gray-400 border-2 w-full py-4 px-4 rounded-full'
                />
                <TextInput 
                  placeholder='Email' 
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}

                  className='border-gray-400 border-2 w-full py-4 px-4 rounded-full'
                />
                <TextInput 
                  placeholder='Password' 
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={passwordSecure}
                  className='border-gray-400 border-2 w-full py-4 px-4 rounded-full'
                />
              <TouchableOpacity disabled={mutation.isPending} className='w-full py-4 mt-6 border-white border-2 rounded-full items-center justify-center bg-blue-800' onPress={() => mutation.mutate()}>
                {mutation.isPending ? <ActivityIndicator size={20}/> : <Text className='text-xl text-fuchsia-100 font-semibold'>S'inscrire</Text>}
              </TouchableOpacity>
            </View>
          <View className='flex flex-row gap-3'>
            <Text className='text-base text-gray-400'>J'ai déja un compte !</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className='text-[#6f74ff]'>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      {/* </ImageBackground> */}
    </View>
    </SheetScreen>
  )
}

export default Login

const styles = StyleSheet.create({
  container : {
    backgroundImage: "../assets/images/background/bg-2.jpg",
    objectFit: "cover",
  }
})