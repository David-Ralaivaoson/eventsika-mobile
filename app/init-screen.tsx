import { useAuth } from '@/context/AuthContext'
import { ImageBackground } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
const bg1 = require('../assets/images/background/bg-1.png')
function Home() {
  const {session, loading} = useAuth()
  const router = useRouter()

  useEffect(()=> {
    if(session) router.replace('/(tabs)')
  },[session])
  
  if(loading) {
    return (
      <ActivityIndicator size={30}/>
    )
  }
  return (
    <View>
      <ImageBackground source={bg1}>
        <View style={styles.container} className='h-[80%] flex items-center justify-center'>
          <Text className='text-5xl font-bold text-fuchsia-100 shadow-slate-500 shadow-lg'>Eventsika</Text>
        </View>
        <View className='h-[20%] flex items-center justify-center gap-4'>
          <TouchableOpacity className='w-[80%] py-4 border-white border-2 rounded-full items-center justify-center' onPress={() => router.push('/login')}>
            <Text className='text-xl text-fuchsia-100 font-semibold'>Se connecter</Text>
          </TouchableOpacity>
          <View className='flex flex-row gap-3'>
            <Text className='text-base text-gray-200'>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text className='text-[#b0b2ff]'>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container : {
    backgroundImage: "../assets/images/background/bg-2.jpg",
    objectFit: "cover",
  }
})