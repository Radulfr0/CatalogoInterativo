// favoritesScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, router } from 'expo-router'; // useFocusEffect para recarregar quando a tela foca
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Tipagem do livro básico (igual à que você já tem)
type Book = {
  key: string;
  title: string;
  cover_id?: number;
  authors?: { name: string }[];
};

const FAVORITES_KEY = '@MyApp:favorites'; // Chave para AsyncStorage (igual à que você já tem)

const FavoritesScreen = () => {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar os livros favoritos do AsyncStorage
  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        const parsedFavorites: Book[] = JSON.parse(favorites);
        setFavoriteBooks(parsedFavorites);
      } else {
        setFavoriteBooks([]); // Garante que a lista esteja vazia se não houver favoritos
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de favoritos.");
      setFavoriteBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Usa useFocusEffect para recarregar os favoritos sempre que a tela for focada
  // Isso garante que se um livro for desfavoritado na tela de detalhes, a lista seja atualizada.
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      return () => {
        // Opcional: qualquer limpeza ao sair do foco
      };
    }, [loadFavorites])
  );

  // Função para remover um livro da lista de favoritos diretamente desta tela
  const removeFavorite = useCallback(async (bookKey: string) => {
    try {
      const currentFavorites = favoriteBooks.filter(book => book.key !== bookKey);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(currentFavorites));
      setFavoriteBooks(currentFavorites); // Atualiza o estado da lista
      Alert.alert("Sucesso", "Livro removido dos favoritos.");
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      Alert.alert("Erro", "Não foi possível remover o livro dos favoritos.");
    }
  }, [favoriteBooks]);


  // Função para navegar para a tela de detalhes de um livro
  const navigateToDetails = (book: Book) => {
    router.push({ pathname: '/detalhes', params: { book: JSON.stringify(book) } }); // Corrigido para 'detalhes'
  };

  // NOVA FUNÇÃO: Função para voltar para a tela inicial (index.tsx)
  const handleGoBack = () => {
    router.back(); // Volta para a tela anterior na pilha de navegação
    // Ou, se você quer ir explicitamente para a raiz, pode usar:
    // router.push('/');
  };

  // Renderiza cada item da lista de livros favoritos
  const renderItem = ({ item }: { item: Book }) => {
    const imageUrl = item.cover_id
      ? `https://covers.openlibrary.org/b/id/${item.cover_id}-M.jpg` // Tamanho M para a lista
      : 'https://via.placeholder.com/100x150.png?text=No+Image';

    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => navigateToDetails(item)}
      >
        <Image source={{ uri: imageUrl }} style={styles.bookCover} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          {item.authors && item.authors.length > 0 && (
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {item.authors.map(a => a.name).join(', ')}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => removeFavorite(item.key)} style={styles.removeFavoriteButton}>
          <Ionicons name="trash-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Botão de Voltar */}
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#2c3e50" />
      </TouchableOpacity>

      <Text style={styles.header}>Meus Livros Favoritos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4682B4" style={styles.loadingIndicator} />
      ) : favoriteBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={80} color="#bdc3c7" />
          <Text style={styles.emptyText}>Você ainda não tem livros favoritos.</Text>
          <Text style={styles.emptyText}>Adicione alguns na tela de detalhes!</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f4f8',
    paddingTop: 50, // Espaço para o cabeçalho e botão de voltar
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
    // marginTop: 10, // Removido ou ajustado, pois o paddingTop do container já dá espaço
  },
  backButton: {
    position: 'absolute', // Posiciona o botão de forma absoluta
    top: 50, // Distância do topo
    left: 15, // Distância da esquerda
    zIndex: 10, // Garante que esteja acima de outros elementos
    padding: 5, // Pequeno padding para facilitar o clique
  },
  loadingIndicator: {
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 10,
  },
  listContentContainer: {
    paddingBottom: 20, // Espaço no final da lista
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#dfe6e9',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  removeFavoriteButton: {
    padding: 10,
    marginLeft: 10,
  },
});

export default FavoritesScreen;