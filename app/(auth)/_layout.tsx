import { Stack } from 'expo-router'
import React from 'react'

export default function AuthLayout() {
  return (
    <Stack>
        <Stack.Screen name='login' options={{headerShown: false, presentation: 'transparentModal', contentStyle: { backgroundColor: 'transparent' }}} />
        <Stack.Screen name='signup' options={{headerShown: false, presentation: 'transparentModal', contentStyle: { backgroundColor: 'transparent' }}} />
    </Stack>
  )
}

