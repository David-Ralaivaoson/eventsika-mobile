import PostEvent from '@/components/home/PostEvent';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';


export default function HomeScreen() {
  const router = useRouter()
  const {user,logout} = useAuth()
  const {data, isLoading} = useQuery({
    queryKey: ['myuniqueData'],
    queryFn: async () => {
      const response = await fetch('http://192.168.88.4:3000/me');
      if(!response.ok) throw new Error('pas de réponse')
      return response.json()
    }
  })
  return (
      <PostEvent />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
