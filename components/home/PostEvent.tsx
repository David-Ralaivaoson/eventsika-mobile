import { useAuth } from '@/context/AuthContext';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Heart, MessageSquareMore, Share2 } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

const API_URL = 'http://192.168.88.4:3000/event';

export default function PostEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [refetchLoad, setRefreshLoad] = useState(false)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['events', user?.id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`${API_URL}?userId=${user?.id}&page=${pageParam}&limit=5`);
      if (!res.ok) throw new Error('Erreur de chargement des événements');
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      const maxPage = Math.ceil(total / limit);
      return page < maxPage ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  const events = data?.pages.flatMap((page) => page.results) ?? [];

  // 🔹 Chargement infini
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      setRefreshLoad(true)
      setTimeout(() => {
        fetchNextPage();
        setRefreshLoad(false)
      }, 2000);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 🔹 Pull-to-refresh : reset toutes les pages et ne charge que la première
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      queryClient.setQueryData(['events', user?.id], {
        pages: [],
        pageParams: [],
      });

      const res = await fetch(`${API_URL}?userId=${user?.id}&page=1&limit=5`);
      const firstPage = await res.json();

      queryClient.setQueryData(['events', user?.id], {
        pages: [firstPage],
        pageParams: [1],
      });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, user?.id]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1e40af" />
        <Text className="text-blue-700 mt-3">Chargement des événements...</Text>
      </View>
    );
  }

  return (
    <View className="bg-gray-200 h-screen">
      <FlatList
        data={events}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <EventItem item={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={
          isFetchingNextPage || refetchLoad ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#1e40af" />
              <Text className="text-center text-gray-500 mt-1">Chargement...</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

// 🔹 Memoized EventItem pour éviter les re-renders inutiles
const EventItem = React.memo(({ item }: { item: any }) => (
  <View className="p-4 w-full min-h-[430px] bg-white my-1">
    {/* Header : profil + prestataire */}
    <View className="flex-row items-start gap-4 mb-3">
      <View className="rounded-full overflow-hidden h-12 w-12">
        <Image source={item.prestataire.user.image} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      </View>
      <View>
        <Text className="text-lg font-semibold">{item.prestataire.user.name}</Text>
        <Text className="text-sm text-gray-500">{item.prestataire.company_name}</Text>
      </View>
    </View>

    {/* Titre & description */}
    <View className="mb-3">
      <Text className="text-lg font-bold">{item.title}</Text>
      <Text className="text-base text-gray-800">{item.description}</Text>
    </View>

    {/* Images */}
    <EventImages images={item.eventMedia} />

    {/* Boutons Like / Commentaire / Partage */}
    <View className="flex-row justify-between items-center mt-2">
      <TouchableOpacity className="w-[32%] bg-gray-100 justify-center items-center rounded-full py-2">
        <Heart size={22} />
      </TouchableOpacity>
      <TouchableOpacity className="w-[32%] bg-gray-100 justify-center items-center rounded-full py-2">
        <MessageSquareMore size={22} />
      </TouchableOpacity>
      <TouchableOpacity className="w-[32%] bg-gray-100 justify-center items-center rounded-full py-2">
        <Share2 size={22} />
      </TouchableOpacity>
    </View>
  </View>
));

// 🔹 Composant pour la grille d’images
function EventImages({ images }: { images: any[] }) {
  if (!images || images.length === 0) return null;

  // 1 image
  if (images.length === 1) {
    return <Image source={images[0].url} style={{ width: '100%', height: 300, borderRadius: 8 }} contentFit="cover" />;
  }

  // 2 images
  if (images.length === 2) {
    return (
      <View className="flex-row gap-1">
        {images.map((m) => (
          <Image key={m.id} source={m.url} style={{ flex: 1, height: 300, borderRadius: 8 }} contentFit="cover" />
        ))}
      </View>
    );
  }

  // 3 images
  if (images.length === 3) {
    return (
      <View className="gap-1">
        <Image source={images[0].url} style={{ width: '100%', height: 200, borderRadius: 8 }} contentFit="cover" />
        <View className="flex-row gap-1">
          {images.slice(1, 3).map((m) => (
            <Image key={m.id} source={m.url} style={{ flex: 1, height: 150, borderRadius: 8 }} contentFit="cover" />
          ))}
        </View>
      </View>
    );
  }

  // 4 images
  if (images.length === 4) {
    return (
      <View className="gap-1">
        {[0, 2].map((i) => (
          <View key={i} className="flex-row gap-1">
            {images.slice(i, i + 2).map((m) => (
              <Image key={m.id} source={m.url} style={{ flex: 1, height: 150, borderRadius: 8 }} contentFit="cover" />
            ))}
          </View>
        ))}
      </View>
    );
  }

  // 5+ images
  return (
    <View className="gap-1">
      <Image source={images[0].url} style={{ width: '100%', height: 200, borderRadius: 8 }} contentFit="cover" />
      <View className="flex-row gap-1">
        {images.slice(1, 3).map((m) => (
          <Image key={m.id} source={m.url} style={{ flex: 1, height: 120, borderRadius: 8 }} contentFit="cover" />
        ))}
      </View>
      <View className="flex-row gap-1">
        {images.slice(3, 5).map((m) => (
          <Image key={m.id} source={m.url} style={{ flex: 1, height: 120, borderRadius: 8 }} contentFit="cover" />
        ))}
      </View>
    </View>
  );
}
