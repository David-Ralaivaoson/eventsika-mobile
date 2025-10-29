import { Stack, useRouter } from 'expo-router';
import React from 'react';

import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Bell, Crown, House, LogOut, MessagesSquare, Plus, Search, Store } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Stack>
      <Stack.Screen name='index' options={{header: () => (<HomeHeader/>)}}/>
      
      <Stack.Screen name="messages/index" options={{header: () => (<NavigationHeader/>)}}/>
      <Stack.Screen name="messages/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

export const HomeHeader = () : React.ReactNode => {
  const {logout} = useAuth()
  const router = useRouter()
  return (
    <View>
      <View className=' items-center justify-between h-16 flex-row px-4 py-2 border-b border-blue-100'>
        <Text className='text-blue-700 font-bold text-2xl'>Eventsika</Text>
        <View className='flex-row gap-2'>
          <TouchableOpacity onPress={async ()=> {}} className='p-2 bg-gray-200 rounded-full'>
            <Plus size={20}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={async ()=> {}} className='p-2 bg-gray-200 rounded-full'>
            <Search size={20}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={async ()=> await logout()} className='p-2 bg-gray-200 rounded-full'>
            <LogOut size={20} className='font-extrabold'/>
          </TouchableOpacity>
        </View>
      </View>
      <View className='p-4 flex flex-row justify-around border-b border-blue-100'>
        <TouchableOpacity onPress={async ()=> {}}>
            <House size={24}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={async ()=> {}}>
            <Crown size={24}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={async ()=> router.push("/messages")}>
            <MessagesSquare size={24}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={async ()=> {}}>
            <Bell size={24}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={async ()=> {}}>
            <Store size={24}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const NavigationHeader = () => {
  const router = useRouter()
  return (
    <View>
    <View className='p-4 flex flex-row justify-around border-b border-blue-100'>
      <TouchableOpacity onPress={async ()=> {}}>
          <House size={24}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={async ()=> {}}>
          <Crown size={24}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={async ()=> router.push("/messages")}>
          <MessagesSquare size={24}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={async ()=> {}}>
          <Bell size={24}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={async ()=> {}}>
          <Store size={24}/>
      </TouchableOpacity>
    </View>
    </View>
  )
}
